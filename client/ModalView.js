class ModalView {
  constructor(element, openId, openFunc = undefined) {
    element.addEventListener("click", () => {
      this.openModal(openId, openFunc);
    });

    Array.from(document.getElementsByClassName("modal-close")).forEach((e) =>
      e.addEventListener("click", ModalView.closeModal)
    );
  }

  //open the modal with the given id
  openModal(id, func) {
    if (func !== undefined) func();
    document.getElementById(id).classList.add("open");
    document.body.classList.add("create-modal-open");
  }
  // close currently open modal
  static closeModal() {
    document.querySelector(".create-modal.open").classList.remove("open");
    document.body.classList.remove("create-modal-open");
  }
}

export default ModalView;

// Here are the associated styles you will need to create the modal
/*
.create-modal {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.75);
  padding: 40px;
  overflow: auto;
}
.create-modal.open {
  display: block;
}
.create-modal-body {
  padding: 20px;
  background: #fff;
  text-align: center;
  min-height: 80%;
  margin-left: 20%;
  margin-right: 20%;
  position: relative;
}
body.create-modal-open {
  overflow: hidden;
  align-items: center;
}
.modal-close {
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 5px;
  margin-right: 2px;
  background: white;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}
*/
