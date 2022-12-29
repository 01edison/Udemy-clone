import { Modal } from "antd";
import { useRef, useEffect, useState } from "react";

const PreviewModal = ({
  media,
  showModal,
  setShowModal,
  isPlaying,
  setIsPlaying,
}) => {
  const video = useRef();

  const play = async () => {
    await video.current?.play();
    setIsPlaying(true);
  };

  const pause = async () => {
    await video.current?.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    play();
  }, [media]);

  return (
    <Modal
      title="Course Preview"
      open={showModal}
      onCancel={() => {
        setShowModal(!showModal);
        pause();
      }}
      footer={null}
      width={720}
    >
      <video
        onClick={isPlaying ? pause : play}
        ref={video}
        src={media}
        controls
        width="100%"
      />
    </Modal>
  );
};

export default PreviewModal;
