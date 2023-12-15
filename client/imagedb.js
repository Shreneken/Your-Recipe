class ImageDB {
  constructor() {
    this.db = new PouchDB("imageBlobs");
  }

  async addBlob(name, blob) {
    try {
      await this.db.put({
        _id: `img:${name}`,
        blob: blob,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getBlob(name) {
    try {
      const doc = await this.db.get(`img:${name}`);
      return doc.blob;
    } catch {
      return null;
    }
  }

  async deleteBlob(name) {
    try {
      const doc = await this.db.get(`img:${name}`);
      await this.db.remove(doc);
    } catch (err) {
      console.log(err);
    }
  }
}

const imageDB = new ImageDB();
export default imageDB;
