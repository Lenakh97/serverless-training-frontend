import React, { Component, Fragment, useEffect, useState } from "react";
import { list, uploadData } from "aws-amplify/storage";
import { del } from "aws-amplify/api";
import { FileTable } from "./table/FileTable";
import { fetchAuthSession } from "aws-amplify/auth";

function bytesToSize(bytes) {
  let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

function getImageDetails(image) {
  let filenameOnly = image.key.replace("photos/", "");
  let modified = image.lastModified.toString();
  let size = image.size;
  let sizeMB = bytesToSize(size);
  let sizeString = sizeMB.toString();

  return {
    key: filenameOnly,
    lastModified: modified,
    size: sizeString,
  };
}
export const PhotosAdmin = () => {
  const [imageName, setImageName] = useState<string>("");
  const [imageFile, setImageFile] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [tableData, setTableData] = useState<any>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [identity, setIdentity] = useState<any>([]);

  const deleteImages = async (keys: Array<string>) => {
    const cognitoID = identity;
    const apiName = "imageAPI";
    const path = "images";
    let that = this;

    await Promise.all(
      keys.map(async function (image) {
        const photoKey = image.key;
        const fullPhotoKey = `private/${cognitoID}/photos/${photoKey}`;
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(
              await fetchAuthSession()
            ).tokens.idToken.toString()}`,
          },
          response: true,
          queryParams: {
            action: "deleteImage",
            key: fullPhotoKey,
          },
        };

        try {
          const delOperation = del({ apiName, path, options });
          await delOperation.response;
          console.log("DELETE call succeeded");
        } catch (error) {
          console.log("DELETE call failed", error);
        }
        that.setState((currentState) => {
          return {
            tableData: currentState.tableData.reduce(function (accum, curVal) {
              if (curVal.key !== photoKey) {
                accum.push(curVal);
              }
              return accum;
            }, []),
          };
        });
      })
    );
    // this.listImages();
  };

  const uploadImage = async () => {
    try {
      const result = await uploadData({
        key: `photos/${this.upload.files[0].name}`,
        data: this.upload.files[0],
        options: {
          contentType: this.upload.files[0].type,
          accessLevel: "private",
        },
      }).result;
      console.log("Succeeded upload: ", result);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const listImages = () => {
    list({ prefix: "photos/", options: { accessLevel: "private" } }).then(
      (result) => {
        const fileArray = Object.values(result);
        const tableData = fileArray[0].map(getImageDetails);
        setTableData(tableData);
        setLoaded(true);
      }
    );
  };

  useEffect(() => {
    listImages();
    fetchAuthSession().then((response) => {
      setIdentity(response.identityId);
    });
  });

  return (
    <Fragment>
      <section className="section">
        <div className="container">
          <div className="App">
            <h2>Upload a new photo</h2>
            <input
              type="file"
              accept="image/png, image/jpeg"
              style={{ display: "none" }}
              ref={(ref) => (this.upload = ref)}
              onChange={() =>
                this.setState({
                  imageFile: this.upload.files[0],
                  imageName: this.upload.files[0].name,
                })
              }
            />
            <input
              value={this.state.imageName}
              placeholder="Select file"
              onChange={(e) => {
                this.handleChange(e);
              }}
            />
            <button
              onClick={() => {
                this.upload.value = null;
                this.upload.click();
              }}
              loading={this.state.uploading}
            >
              Browse
            </button>

            <button onClick={this.uploadImage}> Upload File </button>

            {!!this.state.response && <div>{this.state.response}</div>}
          </div>
          <br />
          {this.state.loaded && (
            <FileTable
              filelist={this.state.tableData}
              deleteImages={this.deleteImages}
            />
          )}
        </div>
      </section>
    </Fragment>
  );
};
