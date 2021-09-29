import React from "react";

// const MyContext = React.createContext();

const FancyButton = React.forwardRef((props, ref) => {
  return (
    <button ref={ref} {...props}>
      {props.children}
    </button>
  );
});

export class Fancy extends React.Component {
  fancyRef = React.createRef();

  fancyClick = () => {
    console.log(this.fancyRef.current);
  };

  render() {
    return (
      <>
        <FancyButton ref={this.fancyRef} onClick={this.fancyClick}>
          fancy button
        </FancyButton>
      </>
    );
  }
}
