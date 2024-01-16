import React, { Component, Fragment } from 'react';
import { list, uploadData } from 'aws-amplify/storage';
import { del } from 'aws-amplify/api';
import { FileTable } from './table/FileTable.js';
import { getCurrentUserInfo } from "./getCurrentUserInfo.js";


function bytesToSize(bytes) {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function getImageDetails(image) {
  let filenameOnly = image.key.replace('photos/', '');
  let modified = image.lastModified.toString();
  let size = image.size;
  let sizeMB = bytesToSize(size);
  let sizeString = sizeMB.toString();

  return {
    'key': filenameOnly,
    'lastModified': modified,
    'size': sizeString
  };
}
export default class PhotosAdmin extends Component {

  state = {
    imageName: '',
    imageFile: '',
    response: '',
    tableData: [],
    loaded: 'false',
    uploading: 'false',
    identity: [],
  };

  deleteImages = async (keys) => {

    const cognitoID = this.state.identity;
    const apiName = 'imageAPI';
    const path = '/images';
    let that = this;
    

    await Promise.all(
      keys.map(async function (image) {
    
        const photoKey = image.key;
        const fullPhotoKey = `private/${cognitoID}/photos/${photoKey}`;
    
        const myInit = {
          headers: {
            'Content-Type': 'application/json'
          },
          response: true,
          queryStringParameters: {  
            action: 'deleteImage',
            key: fullPhotoKey
          },
        };
        try{
           const delOperation = del(apiName, path, myInit);
           await delOperation.response
          console.log('DELETE call succeeded')
        }
        catch (error){
          console.log('DELETE call failed', error)
        }
        that.setState((currentState) => {
          return {
            tableData: currentState.tableData.reduce(function(accum, curVal){
              if (curVal.key !== photoKey) {
                accum.push(curVal);
              }
              return accum;
            }, [])
          };
        });
      })
    );
    // this.listImages();
  }

  uploadImage = () => {
    uploadData({
      key: `photos/${this.upload.files[0].name}`,
      data: this.upload.files[0],
      options: { contentType: this.upload.files[0].type, level: 'private' }
    }).then(() => {
      this.upload = null;
      this.setState(() => ({
        response: 'Success uploading file!',
      }));
      this.listImages();
    }).catch(err => {
      this.setState({ response: `Cannot uploading file: ${err}` });
    });
  };

  listImages = () => {
    list({prefix: 'photos/', options: { level: 'private' }})
      .then(result => {
        const fileArray = Object.values(result);
        const tableData = fileArray.map(getImageDetails);

        this.setState({ 
          tableData
        });
        this.setState({ 
          loaded: true, 
        });
      });
  };

  componentDidMount = () => {
    this.listImages();
    getCurrentUserInfo()
      .then(response => {
        this.setState({
          identity: response.id
        });
      });
  }  

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <div className="App">
              <h2>Upload a new photo</h2>
              <input
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                ref={ref => (this.upload = ref)}
                onChange={() =>
                  this.setState({
                    imageFile: this.upload.files[0],
                    imageName: this.upload.files[0].name
                  })
                }
              />
              <input value={this.state.imageName} placeholder="Select file" onChange={(e) => {this.handleChange(e);}} />
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
            {this.state.loaded && <FileTable filelist={this.state.tableData} deleteImages={this.deleteImages} /> }
          </div>

        </section>
      </Fragment>
    );
  }

}

