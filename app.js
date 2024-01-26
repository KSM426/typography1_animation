import { Visual } from "./visual.js";

class App {
    constructor() {
        this.setWebgl();

        WebFont.load({
            google: {
              families: ['Hind:700']
            },
            fontactive: () => {

                this.visiual = new Visual();

                window.addEventListener('resize', this.resize.bind(this), false);
                this.resize();

                requestAnimationFrame(this.animate.bind(this));
            }
        });
    }

    setWebgl() {
        this.renderer = new PIXI.Renderer({
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            antialias: true,
            transparent: false,
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor : 0x000000,
        });
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();

        const blurFilter = new PIXI.BlurFilter();
        blurFilter.blur = 10;

        // const fragSource = `
        //     precision mediump float;
        //     varying vec2 vTextureCoord;
        //     uniform sampler2D uSampler;
        //     uniform float threshold;
        //     uniform float mr;
        //     uniform float mg;
        //     uniform float mb;
        //     void main(void) {
        //         vec4 color = texture2D(uSampler, vTextureCoord);
        //         vec3 mcolor = vec3(mr, mg, mb);
        //         if(color.a > threshold) {
        //             gl_FragColor = vec4(color.rgb, 1.0);
        //         } else {
        //             gl_FragColor = vec4(vec3(0.0), 0.0);
        //         }
        //     }            
        // `;

        // const uniformsData = {
        //     threshold: 0.5,
        //     mr: 0.0 / 255.0,
        //     mg: 0.0 / 255.0,
        //     mb: 0.0 / 255.0,
        // };

        const fragSource = `
            precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float threshold;
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                if(color.a > threshold) {
                    gl_FragColor = vec4(color.rgb, 1.0);
                } else {
                    gl_FragColor = vec4(vec3(0.0), 0.0);
                }
            }            
        `;


        const uniformsData = {
            threshold: 0.5,
        };

        const thresholdFillter = new PIXI.Filter(null, fragSource, uniformsData);

        this.stage.filters = [blurFilter, thresholdFillter];
        this.stage.filterArea = this.renderer.screen;
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.renderer.resize(this.stageWidth, this.stageHeight);

        this.visiual.show(this.stageWidth, this.stageHeight, this.stage);
    }

    animate(t) {
        requestAnimationFrame(this.animate.bind(this));

        this.visiual.animate();

        this.renderer.render(this.stage);
    }


}

window.onload = () => {
    new App();
};