// for more, please see the commonfileuploderHelp.txt file
var CommonFileUpload = function (_http) {
  alert(_http)
  //"use strict"

  var $this = this;// hold for here local use

  // public
  $this.deleteCallback = null;
  $this.trimChars = 20;


  // private
  var $http = _http;
  var rootFolder = "UploadFolder";
  // file upload input params
  var inputFileUploadObj = {
    callback: null,// mandatory for control back to caller
    file: null,// mandatory file type obj.
    folderName: null,// mandatory save folder name
    acceptExtentions: null,//optional ".jpg,.jpeg,.pdf,.png"
    acceptFileSize: null// optional "1kb"/"1mb"
  }
  // response
  var uploadFileResponseModel = {
    code: 1,// 1=success,0=failed
    msg: "",// when field
    displayFileName: "",//xyz.pdf" = selected file name
    filePath: "",// "/master/8c75081e60eb4007b2d1b686a9ffbb11.pdf" = saved physical(folder) path
    savedFileName: "",//"8c75081e60eb4007b2d1b686a9ffbb11.pdf" = saved(unique) file name
    fileId: ""
  };


  // public
  $this.uploadFile = function (inputFileUploadObj) {
    alert('hhhhh');
    if (isNullOrWhiteSpace(inputFileUploadObj)) {
      file.value = "";
      bootbox.alert("Invalid request");
      return false;
    }
    // set params
    var callback = inputFileUploadObj.callback;
    var file = inputFileUploadObj.file;
    var folderName = inputFileUploadObj.folderName;
    var acceptExtentions = inputFileUploadObj.acceptExtentions;
    var acceptFileSize = inputFileUploadObj.acceptFileSize;

    // callback
    if (isNullOrWhiteSpace(callback)) {
      bootbox.alert("Please send callback function");
      return false;
    }
    // file
    if (isNullOrWhiteSpace(file) || file.files.length <= 0) {
      uploadFileResponseModel.code = 0;
      uploadFileResponseModel.msg = "Please select file";
      uploadFileResponseModel["fileId"] = file.id;
      callbackFunction(callback, uploadFileResponseModel);
      return false;
    }
    // folder
    if (isNullOrWhiteSpace(folderName)) {
      file.value = "";
      uploadFileResponseModel.code = 0;
      uploadFileResponseModel.msg = "Please enter folder name";
      uploadFileResponseModel["fileId"] = file.id;
      callbackFunction(callback, uploadFileResponseModel);
      return false;
    }
    // extention
    if (!isNullOrWhiteSpace(acceptExtentions)) {
      var _validFileExtensions = acceptExtentions.toLowerCase().split(',');
      if (_validFileExtensions.indexOf("." + file.value.split('.').pop().toLowerCase()) == -1) {
        file.value = '';
        uploadFileResponseModel.code = 0;
        uploadFileResponseModel.msg = `Invalid extention, allowed only ${acceptExtentions}`;
        uploadFileResponseModel["fileId"] = file.id;
        callbackFunction(callback, uploadFileResponseModel);
        return false;
      }
    }
    // size
    if (parseInt(acceptFileSize || 0) > 0) {
      var fileSize = 0;
      if (acceptFileSize.toLowerCase().indexOf("mb") != -1) {
        fileSize = Math.round(file.files[0].size / 1024 / 1024);
      }
      else if (acceptFileSize.toLowerCase().indexOf("kb") != -1) {
        fileSize = Math.round(file.files[0].size / 1024);
      }
      if (fileSize > parseInt(acceptFileSize || 0)) {
        file.value = '';
        uploadFileResponseModel.code = 0;
        uploadFileResponseModel.msg = `Invalid file size, allowed only ${acceptFileSize}`;
        uploadFileResponseModel["fileId"] = file.id;
        callbackFunction(callback, uploadFileResponseModel);
        return false;
      }
    }

    // save
    uploadFileOnServer(callback, file, folderName);
  }

  $this.bindFileUploadActionElements = function (elemId, _uploadFileResponseModel) {// elemId = fileid
    _uploadFileResponseModel.filePath = "/" + rootFolder + _uploadFileResponseModel.filePath;
    createFileUploadActionElements(elemId, _uploadFileResponseModel);
  }

  $this.IsFileSelected = function (fileId) {
    return $(`#${fileId}`).closest('.clsFileElements').next('.clsFileActionElements').length == 1;
  }

  // private
  var callbackFunction = function (callback, respData) {
    if (typeof callback == "function") {
      callback(respData);
    }
  }
  function isNullOrWhiteSpace(val) {
    return (val === undefined || val == null || val.length <= 0);
  }
  var uploadFileOnServer = function (callback, file, folderName) {

    var formData = new FormData();
    formData.append("FolderName", folderName);
    formData.append("file", file.files[0]);
    $http.post(SiteUrl + "master/UploadFile", formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
      }).
      success(function (data, status, message) {
        if (data.code == 1) {
          file.value = "";
          createFileUploadActionElements(file.id, data);
          data["fileId"] = file.id;
          callbackFunction(callback, data);
          return false;
        }
        else {
          file.value = "";
          data["fileId"] = file.id;
          callbackFunction(callback, data);
          return false;
        }
      }).
      error(function (data, status) {
        file.value = "";
        uploadFileResponseModel.code = 0;
        uploadFileResponseModel.msg = "error occured";
        uploadFileResponseModel["fileId"] = file.id;
        callbackFunction(callback, uploadFileResponseModel);
        return false;
      })
  }

  var createFileUploadActionElements = function (elemId, data) {
    $("#" + elemId).closest(".clsFileUpload").find(".clsFileElements").hide();

    var _html = '<div class="clsFileActionElements b1 d-flex gap-2">'
      + '<label class="clsdisplay btn btn-disabled pb-0 text-left" style="text-transform: unset; !important;"></label>'
      + '<a href="javascript:void(0);" class="clsview" target="_blank"><i class="fa fa-eye"></i></a>'
      + '<a href="javascript:void(0);" class="clsdelete border-0 bg-transparent ml-1"><i class="fa fa-trash"></i></a></div>';

    $("#" + elemId).closest(".clsFileUpload").append(_html);
    var trimdisplayFileName = data.displayFileName;
    if (trimdisplayFileName.length > $this.trimChars) {
      trimdisplayFileName = "..." + (trimdisplayFileName.slice(-$this.trimChars));
    }
    $("#" + elemId).closest(".clsFileUpload").find(".clsdisplay").text(trimdisplayFileName);
    $("#" + elemId).closest(".clsFileUpload").find(".clsview").attr("href", data.filePath);
    $("#" + elemId).closest(".clsFileUpload").find(".clsdelete").attr("file-path", data.filePath);
    $("#" + elemId).closest(".clsFileUpload").find(".clsdelete").attr("file-id", elemId);
  }

  var enableFileUploadOnly = function (elem) {
    elem.closest(".clsFileUpload").find(".clsFileElements").show();
    elem.closest(".clsFileUpload").find(".clsFileActionElements").remove();
  }

  var deleteUploadedFile = function (del) {
    var formData = new FormData();
    formData.append("filePath", del.attr("file-path"));
    $http.post(SiteUrl + "master/DeleteUploadFile", formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
      }).
      success(function (data, status, message) {
        if (data.code == 1) {
          uploadFileResponseModel.code = 1;
          uploadFileResponseModel.msg = "";
          uploadFileResponseModel["fileId"] = del.attr("file-id");
          enableFileUploadOnly(del);
          callbackFunction($this.deleteCallback, uploadFileResponseModel);
          return false;
        }
        else {
          uploadFileResponseModel.code = 0;
          uploadFileResponseModel.msg = data.msg;
          uploadFileResponseModel["fileId"] = del.attr("file-id");
          callbackFunction($this.deleteCallback, uploadFileResponseModel);
          return false;
        }
      }).
      error(function (data, status) {
        uploadFileResponseModel.code = 0;
        uploadFileResponseModel.msg = "error occured";
        uploadFileResponseModel["fileId"] = del.attr("file-id");
        callbackFunction($this.deleteCallback, uploadFileResponseModel);
        return false;
      })
  }


  // load
  // jquery
  $(document).on("click", ".clsdelete", function () {
    deleteUploadedFile($(this));
  });
} 




