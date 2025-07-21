class KeyHandler{
    constructor(){
        const keys = {
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

        keys.forEach(key => {
            this.keysAr.append(new Key(key));
        });
    }

    isNewKeyPressed(keyName="enter"){
        keys.forEach(key => {
            if (key.key == keys[keyName]){
                key.isNewKeyPressed("key");
            }
        });
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
        if(!keyIsDown(key)){
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