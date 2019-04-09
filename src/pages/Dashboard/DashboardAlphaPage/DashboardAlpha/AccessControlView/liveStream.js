/* eslint-disable no-undef */
import { mobileSDK } from 'ducks/Milestone'
import $ from 'jquery'

let VideoConnectionSignal = {
  live: 1,
  playback: 2,
}
class accessStream {
  constructor(camera) {
    this.Id = camera.Id;

    this.image = document.getElementById("accessPointCamera");
    if (this.image === null) return null;
    this.image.addEventListener('load', this.onImageLoad);
    this.image.addEventListener('error', this.onImageError);
    this.destination = { width: 800, height: 600 };
    this.videoConnectionObserver = {
      videoConnectionReceivedFrame: this.videoConnectionReceivedFrame,
    };
    this.isLive = true;
    this.loading = true;

    /**
     * Requesting a video stream.
     */
    this.streamRequest = mobileSDK.requestStream(
      this.Id,
      this.destination,
      null,
      this.requestStreamCallback,
      function(error) {},
    )

  }

  /**
   * Close Video stream request
   */
  closeVideoConnection = () => {
    console.log('close video id', this.videoController)
    if (this.videoController) {
      mobileSDK.closeStream(this.videoController.videoId)
    }
  };

  /**
   * Video stream request callback
   */
  requestStreamCallback = videoConnection => {
    if (videoConnection != null) {
      this.videoController = videoConnection
      videoConnection.addObserver(this.videoConnectionObserver)
      videoConnection.open()
    }
  }

  /**
   * Executed on received frame.
   */
  videoConnectionReceivedFrame = frame => {
    if (!this.drawing && frame.dataSize > 0) {
      this.drawing = true

      if (frame.hasSizeInformation) {
        var multiplier =
          frame.sizeInfo.destinationSize.resampling * mobileSDK.getResamplingFactor() || 1
        this.image.width = multiplier * frame.sizeInfo.destinationSize.width
        this.image.height = multiplier * frame.sizeInfo.destinationSize.height
      }
      if (this.imageURL) {
        window.URL.revokeObjectURL(this.imageURL)
      }

      this.imageURL = window.URL.createObjectURL(frame.blob)
      if (this.loading) {
        $('#cameraLoadingArea')[0].style.display = 'none'
        this.loading = false
      }
      this.image.src = this.imageURL
    }
  }

  /**
   * Executed on image load.
   */
  onImageLoad = event => {
    this.drawing = false
  }

  onImageError = event => {
    this.drawing = false
  }

  /**
   * Stop camera stream
   */
  stop = () => {
    if (this.videoController) {
      this.videoController.removeObserver(this.videoConnectionObserver)
      this.videoController.close()
      this.videoController = null
    }
    if (this.streamRequest) {
      mobileSDK.cancelRequest(this.streamRequest)
      this.streamRequest = null
    }
  }

  resetState = () => {
    this.playbackSpeed = 0

    if (this.streamRequest) {
      mobileSDK.cancelRequest(this.streamRequest)
      this.streamRequest = null
    }
  }

  /**
   * Switch camera to live video
   */
  switchToLive = () => {
    if (this.isLive) return
    this.loading = true
    $('#cameraLoadingArea' + this.Id)[0].style.display = 'flex'

    this.isLive = true

    this.playBackTime = {}

    this.stop()

    this.resetState()

    this.streamRequest = mobileSDK.requestStream(
      this.Id,
      this.destination,
      null,
      this.requestStreamCallback,
      function(error) {},
    )
  }
}

export { accessStream }
