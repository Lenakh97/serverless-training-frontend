import React, { Component, Fragment } from "react";
import { list, getUrl } from "aws-amplify/storage";
import { get } from "aws-amplify/api";
import ImageGallery from "react-image-gallery";
import { getCurrentUserInfo } from "../getCurrentUserInfo";
import { fetchAuthSession } from "aws-amplify/auth";

let images = [];

async function getPresignedURLS(orig, thumb) {
  let presignOriginal = await getUrl({
    key: orig,
    options: { accessLevel: "private", useAccelerateEndpoint: false },
  });
  console.log(presignOriginal);
  let presignThumb = await getUrl({
    key: thumb,
    options: {
      accessLevel: "private",
      useAccelerateEndpoint: false,
    },
  });
  let results = [presignOriginal.url, presignThumb.url];
  return Promise.resolve(results);
}

async function getPhotoLabels(key) {
  const apiName = "imageAPI";
  const path = "images";

  const options = {
    // OPTIONAL
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(
        await fetchAuthSession()
      ).tokens.idToken.toString()}`,
    },
    response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryParams: {
      // OPTIONAL
      action: "getLabels",
      key: key,
    },
  };

  let result;
  try {
    const apiResponse = get({ apiName, path, options });
    const { body } = await apiResponse.response;
    result = await body.json();
    console.log("GET call succeeded");
  } catch (error) {
    console.log("GET call failed: ", error);
  }
  let results = [result];
  return Promise.resolve(results);
}

export default class Photos extends Component {
  state = {
    response: "",
    filelist: "",
    cognitoSub: "",
    loaded: false,
    pr: "",
  };

  getId = () => {
    getCurrentUserInfo().then((response) => {
      this.setState({ cognitoSub: response.id });
    });
  };

  listImages = async () => {
    const result = await list({
      prefix: "photos/",
      options: { accessLevel: "private" },
    });
    let fileArray = Object.values(result.items);
    //const cognitoID = "us-east-2:f0176eaa-50cd-4805-a44c-f0def68d78d5";
    const cognitoID = this.state.cognitoSub;
    console.log("cognito", cognitoID);
    const fileNames = fileArray.map(function (image) {
      return image.key.replace("photos/", "");
    });

    this.setState({ filelist: fileNames });

    fileNames.forEach(addImagesToList);
    console.log(fileNames);

    function addImagesToList(filename) {
      let orig = "photos/".concat(filename);
      console.log("orig", orig);
      let fullName = "private/"
        .concat(cognitoID)
        .concat("/photos/")
        .concat(filename);
      console.log("fullName:", fullName);
      getPresignedURLS(orig, orig).then((result) => {
        let originalImageSigned = result[0];
        console.log(originalImageSigned.pathname);
        let thumbImageSigned = result[1];
        let currentImg = {
          original: originalImageSigned,
          thumbnail: thumbImageSigned,
          description: "Testing Description",
          isSelected: false,
        };
        images.push(currentImg);
        const fullName2 = originalImageSigned.pathname
          .replace("%3A", ":")
          .slice(1);
        console.log(fullName2);

        getPhotoLabels(fullName2).then((result) => {
          let allLabels = result[0][0];
          if (allLabels) {
            let labelsDetected = Object.values(allLabels);
            const filterLabels = (cut, list) =>
              list
                .filter((label) => !label.S.includes(cut))
                .map((element) => element.S);

            let filtered = filterLabels("private", labelsDetected).join(" * ");
            for (let i in images) {
              if (images[i].original.pathname.includes(filename)) {
                images[i].description = filtered;
                break; //Stop this loop, we found it!
              }
            }
          }
        });
      });
    }
    this.setState({ pr: true });
  };

  componentDidMount = async () => {
    this.getId();
    this.listImages();
    this.setState({ loaded: true });
  };

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Your Photos</h1>
            <p className="subtitle is-5">Review your photographs and labels</p>
            <br />
            <div className="columns">
              <div className="column">
                {this.state.pr ? (
                  <ImageGallery items={images} thumbnailPosition="left" />
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
