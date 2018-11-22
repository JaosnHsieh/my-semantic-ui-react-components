import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon, Input, Button } from "semantic-ui-react";

const styles = {
  editIcon: {
    marginLeft: "5px"
  },
  checkBtn: {
    background: "#3B5B87",
    color: "white"
  }
};
class EditableTextContainer extends Component {
  constructor(props) {
    super(props);
    this.inputDomRef = React.createRef();
  }
  state = {
    isEditing: false,
    editingText: this.props.text || "",
    isBtnLoading: false
  };
  setIsEditing = (bool = true) => {
    this.setState({ isEditing: bool }, () => {
      if (bool && this.inputDomRef.current) {
        this.inputDomRef.current.focus();
      }
    });
  };
  onTextChange = (e, { value }) => {
    this.setState({ editingText: value });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      this.setState({ editingText: nextProps.text });
    }
  }
  render() {
    const {
      text = "",
      onSubmit,
      size = "small",
      textStyle = {},
      placeholderText = "empty....."
    } = this.props;
    const { isEditing } = this.state;
    return (
      <div>
        {isEditing ? (
          <span>
            <form
              onSubmit={e => {
                e.preventDefault();
                const value = onSubmit(this.state.editingText);
                if (value && value.then) {
                  this.setState({ isBtnLoading: true }, () => {
                    value.then(() => {
                      this.setState({
                        isEditing: false,
                        isBtnLoading: false
                      });
                    });
                  });
                } else {
                  this.setState({
                    isEditing: false
                  });
                }
              }}
            >
              <Input
                ref={this.inputDomRef}
                value={this.state.editingText}
                onChange={this.onTextChange}
                size={size}
                placeholder={placeholderText}
                required
              />
              <Button
                size={size}
                icon="check"
                loading={this.state.isBtnLoading}
                style={styles.checkBtn}
              />
              <Button
                size={size}
                icon="close"
                onClick={() => {
                  this.setState({
                    isEditing: false,
                    editingText: this.props.text
                  });
                }}
              />
            </form>
          </span>
        ) : (
          <span style={textStyle}>
            {text ? text : placeholderText}
            <Icon
              onClick={() => {
                this.setIsEditing(true);
              }}
              name="edit"
              color="grey"
              style={styles.editIcon}
            />
          </span>
        )}
      </div>
    );
  }
}

EditableTextContainer.propTypes = {
  text: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired, // if return promise will wait for that
  size: PropTypes.string, // semantic Input, Button props
  textStyle: PropTypes.object,
  placeholderText: PropTypes.string
};

// asnyc
export class Usage extends React.Component {
  state = {
    text: "async example"
  };
  render() {
    return (
      <EditableTextContainer
        text={this.state.text}
        onSubmit={editedText =>
          //async action to call update api
          new Promise((resolve, reject) => {
            setTimeout(() => {
              this.setState({
                text: editedText
              });
              resolve();
            }, 500);
          })
        }
        size={"mini"}
      />
    );
  }
}

export class Usage2 extends React.Component {
  state = {
    text: "sync example text"
  };
  render() {
    return (
      <EditableTextContainer
        text={this.state.text}
        onSubmit={editedText => {
          this.setState({
            text: editedText
          });
        }}
        textStyle={{ color: "grey", fontSize: "10px" }}
        size={"mini"}
      />
    );
  }
}

export default EditableTextContainer;
