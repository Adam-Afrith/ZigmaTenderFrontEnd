<div className="col-sm-6 row d-flex align-items-center mb-4 ">
            {fileCheck && (
              <>
                <div className="col-lg-3 text-dark font-weight-bold">
                  <label className="font-weight-bold">Preview</label>
                </div>
                <motion.div
                  className="col-lg-9"
                  initial={{ scale: 0.5, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.1,
                    delay: 0.1,
                  }}
                >
                  <>
                    <div className="upload_Documents">
                      <div className="card  my-4">
                        <div className="card-body">
                          {/* <div className="noOfCountsForUpload">{''}</div> */}
                          <div className="UploadingDetails">
                            <div>
                              <h6> Name : </h6> <span>{file.name}</span>
                            </div>
                            <div>
                              <h6> Size : </h6> <span>{file.size}</span>
                            </div>
                          </div>
                          <div className="UploadImg">
                            <img src={file.src} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                </motion.div>
              </>
            )}

            {editCheck && (
              <>
                <div className="col-lg-3 text-dark font-weight-bold">
                  <label className="font-weight-bold">Preview</label>
                </div>
                <motion.div
                  className="col-lg-9"
                  initial={{ scale: 0.5, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.1,
                    delay: 0.1,
                  }}
                >
                  <>
                    <div className="upload_Documents">
                      <div className="card  my-4">
                        <div className="card-body">
                          {/* <div className="noOfCountsForUpload">{''}</div> */}
                          <div className="UploadingDetails">
                            <div>
                              <h6> Name : </h6>{" "}
                              <span>{currentRow.originalfilename}</span>
                            </div>
                            <div>
                              <h6> Size : </h6>{" "}
                              <span>{currentRow.filesize}</span>
                            </div>
                          </div>
                          <div className="UploadImg">
                            <img src={currentRow.pic} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                </motion.div>
              </>
            )}
          </div>