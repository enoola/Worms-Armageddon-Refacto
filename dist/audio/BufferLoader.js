export class BufferLoader {
    constructor(context, urlList, onLoad) {
        this.bufferList = [];
        this.loadCount = 0;
        this.context = context;
        this.urlList = urlList;
        this.onLoad = onLoad;
    }
    load() {
        for (let i = 0; i < this.urlList.length; i++) {
            this.loadBuffer(this.urlList[i], i);
        }
    }
    loadBuffer(url, index) {
        const name = this._extractName(url);
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = () => {
            this.context.decodeAudioData(request.response, (buffer) => {
                this.bufferList[index] = { name, buffer };
                this._checkIfAllLoaded();
            }, (error) => {
                console.error("Error decoding audio data:", error);
                this.bufferList[index] = { name, buffer: null };
                this._checkIfAllLoaded();
            });
        };
        request.onerror = () => {
            console.error(`XHR error loading ${url}`);
            this.bufferList[index] = { name, buffer: null };
            this._checkIfAllLoaded();
        };
        request.send();
    }
    _checkIfAllLoaded() {
        const loadedBuffers = this.bufferList.filter(b => b.buffer !== null).length;
        if (loadedBuffers === this.urlList.length) {
            this.onLoad(this.bufferList.map(b => ({ name: b.name, buffer: b.buffer })));
        }
    }
    _extractName(url) {
        const match = url.match(/([a-zA-Z0-9_-]+)\.\w+/);
        return match ? match[1] : url;
    }
}
