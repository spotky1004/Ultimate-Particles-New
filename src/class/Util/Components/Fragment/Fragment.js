class Fragment {
  constructor(data) {
    /** @type {DocumentFragment} */
    this.fragment = new DocumentFragment();
  }

  clone() {
    return this.fragment.cloneNode(true).childNodes[0];
  }
}

export default Fragment;