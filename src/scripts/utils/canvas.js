//---VARIABLE---//

export default canvas = {
    el: document.getElementById("canvas"),

    init: function(){
        this.ctx = this.el.getContext('2d', { alpha: true });

        this.resize();

        window.addEventListener('resize', this.resize.bind(this), false);
    },

    resize: function(){
        this.el.width = this.el.clientWidth;
        this.el.height = this.el.clientHeight;
    },
    draw: function(){
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    
        // ctx.fillStyle = "#222024";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}