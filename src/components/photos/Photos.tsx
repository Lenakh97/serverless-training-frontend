import React, { Fragment, useEffect, useState } from "react";
import { list, getUrl } from "aws-amplify/storage";
import { get } from "aws-amplify/api";
import ImageGallery, { type ReactImageGalleryItem } from "react-image-gallery";
import { fetchAuthSession } from "aws-amplify/auth";

let images: ReactImageGalleryItem[] = [];

const getPresignedURLS = async (orig: string, thumb: string) => {
  let presignOriginal = await getUrl({
    key: orig,
    options: { accessLevel: "private", useAccelerateEndpoint: false },
  });
  let presignThumb = await getUrl({
    key: thumb,
    options: {
      accessLevel: "private",
      useAccelerateEndpoint: false,
    },
  });
  let results = [presignOriginal.url, presignThumb.url];
  return Promise.resolve(results);
};

const getPhotoLabels = async (key: string) => {
  const apiName = "imageAPI";
  const path = "images";
  const token = (await fetchAuthSession()).tokens?.idToken?.toString();
  const options = {
    // OPTIONAL
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
};

export const Photos = () => {
  const [response, setResponse] = useState<string>("");
  const [filelist, setFilelist] = useState<string[]>([]);
  const [cognitoSub, setCognitoSub] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [pr, setPr] = useState<boolean>();

  const getId = () => {
    fetchAuthSession().then((response): void => {
      setCognitoSub(response.identityId ?? "");
    });
  };

  const listImages = async () => {
    const result = await list({
      prefix: "photos/",
      options: { accessLevel: "private" },
    });
    let fileArray = Object.values(result.items);
    const cognitoID = cognitoSub;
    const fileNames = fileArray.map(function (image) {
      return image.key.replace("photos/", "");
    });

    setFilelist(fileNames);

    const addImagesToList = (filename: string) => {
      let orig = "photos/".concat(filename);
      let thumb = "thumbnails/".concat(filename);
      let fullName = "private/"
        .concat(cognitoID)
        .concat("/photos/")
        .concat(filename);
      getPresignedURLS(orig, thumb).then((result) => {
        let originalImageSigned = result[0];
        let thumbImageSigned = result[1];
        let currentImg = {
          original: String(originalImageSigned),
          thumbnail: String(thumbImageSigned),
          description: "Testing Description",
          isSelected: false,
        };
        images.push(currentImg);

        getPhotoLabels(fullName).then((result) => {
          let allLabels = result[0][0];
          if (allLabels) {
            let labelsDetected = Object.values(allLabels);
            const filterLabels = (cut: string, list: any[]) =>
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
    };
    fileNames.forEach(addImagesToList);

    setPr(true);
  };

  useEffect(() => {
    getId();
    listImages();
    setLoaded(true);
  });

  return (
    <Fragment>
      <section className="section">
        <div className="container">
          <h1>Your Photos</h1>
          <p className="subtitle is-5">Review your photographs and labels</p>
          <br />
          <div className="columns">
            <div className="column">
              {pr ? (
                <ImageGallery items={images} thumbnailPosition="left" />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
