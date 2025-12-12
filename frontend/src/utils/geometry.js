// frontend/src/utils/geometry.js

/**
 * Вычисление привязки позиции элемента.
 *
 * @param {Object} params
 * @param {number} params.x - исходная X
 * @param {number} params.y - исходная Y
 * @param {number} params.width
 * @param {number} params.height
 * @param {Array<{x:number,y:number,width:number,height:number}>} params.others - остальные элементы
 * @param {number} params.gridSize
 * @param {boolean} params.snapToGrid
 * @param {boolean} params.snapToElements
 * @param {number} params.threshold - допуск по пикселям
 */
export function computeSnap({
    x,
    y,
    width,
    height,
    others = [],
    gridSize = 8,
    snapToGrid = true,
    snapToElements = true,
    threshold = 5
}) {
    let nx = x;
    let ny = y;

    // Привязка к сетке
    if (snapToGrid && gridSize > 0) {
        nx = Math.round(nx / gridSize) * gridSize;
        ny = Math.round(ny / gridSize) * gridSize;
    }

    if (snapToElements && others.length > 0) {
        const selfLeft = nx;
        const selfTop = ny;
        const selfRight = nx + width;
        const selfBottom = ny + height;

        let snapLeft = nx;
        let snapTop = ny;

        for (const el of others) {
            const oLeft = el.x;
            const oTop = el.y;
            const oRight = el.x + el.width;
            const oBottom = el.y + el.height;

            // по X
            if (Math.abs(selfLeft - oLeft) <= threshold) snapLeft = oLeft;
            if (Math.abs(selfRight - oRight) <= threshold)
                snapLeft = oRight - width;
            if (Math.abs(selfLeft - oRight) <= threshold)
                snapLeft = oRight;
            if (Math.abs(selfRight - oLeft) <= threshold)
                snapLeft = oLeft - width;

            // по Y
            if (Math.abs(selfTop - oTop) <= threshold) snapTop = oTop;
            if (Math.abs(selfBottom - oBottom) <= threshold)
                snapTop = oBottom - height;
            if (Math.abs(selfTop - oBottom) <= threshold)
                snapTop = oBottom;
            if (Math.abs(selfBottom - oTop) <= threshold)
                snapTop = oTop - height;
        }

        nx = snapLeft;
        ny = snapTop;
    }

    return { x: nx, y: ny };
}
