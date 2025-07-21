class KeyHandler{
    constructor(){
        this.keys = {
        "a": 65,
        "w": 87,
        "s": 83,
        "d": 68,
        "up": 38,
        "down": 40,
        "left": 37,
        "right": 39,
        "enter": 13,
        "j": 74,
        "k": 75,
        "space": 32
        };
        this.keysAr = [];

        Object.keys(this.keys).forEach(keyName => {
            this.keysAr.push(new Key(this.keys[keyName]));
            });
    }

    isNewKeyPressed(keyName = "enter") {
        return this.keysAr.some(key => key.key === this.keys[keyName] && key.isNewPressed());
    }
    
}

class Key{
    constructor(key){
        this.key = key;
        this.lock = false
    }

    isNewPressed(){
        if((!this.lock) && keyIsDown(this.key)){
            this.lock = true;
            return true;
        }
        if(!keyIsDown(this.key)){
            this.lock = false;
        }
        return false;
    }

    isPressed(){
        if(keyIsDown(key)){
            return true;
        }
        return false;
    }
}