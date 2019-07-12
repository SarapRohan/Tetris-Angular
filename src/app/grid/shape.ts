import { Type } from './type';

export class Shape {
    type: Type.type;
    position: number[][];
    layout: number[][];
    rotatedRight: number[][];

    constructor(type: Type.type) {
        this.type = type;
        this.layout = Type.layout[Type.type[this.type]];
        this.rotateRight();        
    }

    rotateRight(): void {
        let rightLayout = [];
        const row = this.layout.length;
        const col = this.layout[0].length;
        for (let i = 0; i < col; i++) {
            rightLayout[i] = [];
            for (let j = row - 1; j >= 0; j--)
                rightLayout[i].push(this.layout[j][i]);
        }
        this.layout = rightLayout;
    }
}