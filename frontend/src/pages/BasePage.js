import React, { Component } from "react";

class BasePage extends Component {
  renderContainer(children) {
    return <div className="container">{children}</div>;
  }

  setTitle(title) {
    document.title = title;
  }

}

export default BasePage;
