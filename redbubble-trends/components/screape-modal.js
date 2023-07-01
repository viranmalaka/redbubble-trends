import { Button, Modal, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

function ScrapeModal() {
  const [visible, setVisible] = useState(false);

  const [content, setContent] = useState("");

  useEffect(() => {
    (async () => {
      const data = await axios.get("/browser-script.js");
      console.log(data);
      setContent(data.data);
    })();
  }, []);

  return (
    <>
      <Button onClick={() => setVisible(true)}>Scrape</Button>
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        width={800}
        bodyStyle={{ height: 700 }}
        onOk={() => {
          let text = document.getElementById("my-code").innerText;

          // Copy the text inside the text field
          navigator.clipboard.writeText(content);
          setVisible(false);
          setTimeout(() => {
            window.open("https://redbubble.com", "_blank");
          }, 1000);
        }}
      >
        <div style={{ height: 600, overflow: "auto" }}>
          <Typography copyable={{ format: "text/plain" }} id="my-code">
            {content}
          </Typography>
        </div>
      </Modal>
    </>
  );
}

export default ScrapeModal;
