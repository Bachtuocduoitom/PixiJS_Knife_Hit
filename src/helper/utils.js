export class Util {
    static random(min, max) {
      return Math.random() * (max - min) + min;
    }

    static randomInteger(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    static registerOnPointerDown(displayObject, onPointerDown, context) {
        displayObject.eventMode = 'static';
        displayObject.on("pointerdown", onPointerDown, context);
      }
  
    static AABBCheck(a, b) {
        const aBox = a.getBounds();
        const bBox = b.getBounds();
        return aBox.x + aBox.width > bBox.x &&
            aBox.x < bBox.x + bBox.width &&
            aBox.y + aBox.height > bBox.y &&
            aBox.y < bBox.y + bBox.height
    }
  
    static SATPolygonPolygon(points1, points2) {
        let a = points1
        let b = points2
        let polygons = [a, b]
        let minA, maxA, projected, minB, maxB, j
        for (let i = 0; i < polygons.length; i++)
        {
            let polygon = polygons[i]
            for (let i1 = 0; i1 < polygon.length; i1 += 2)
            {
                let i2 = (i1 + 2) % polygon.length
                let normal = { x: polygon[i2 + 1] - polygon[i1 + 1], y: polygon[i1] - polygon[i2] }
                minA = maxA = null
                for (j = 0; j < a.length; j += 2)
                {
                    projected = normal.x * a[j] + normal.y * a[j + 1]
                    if (minA === null || projected < minA)
                    {
                        minA = projected
                    }
                    if (maxA === null || projected > maxA)
                    {
                        maxA = projected
                    }
                }
                minB = maxB = null
                for (j = 0; j < b.length; j += 2)
                {
                    projected = normal.x * b[j] + normal.y * b[j + 1]
                    if (minB === null || projected < minB)
                    {
                        minB = projected
                    }
                    if (maxB === null || projected > maxB)
                    {
                        maxB = projected
                    }
                }
                if (maxA < minB || maxB < minA)
                {
                    return false
                }
            }
        }
        return true
    }

    static find4Vertex(knife) {
        let centerX = knife.collider.getBounds().x + knife.collider.getBounds().width/2;    //toa do x cua tam 
        let centerY = knife.collider.getBounds().y + knife.collider.getBounds().height/2;   //toa do y cua tam
        let ang = - knife.angle * Math.PI / 180;    //angle
        let wid = knife.collider.width;     //width
        let hei = knife.collider.height;    //height
        
        //TOP RIGHT VERTEX:
        let Top_RightX = centerX + ((wid / 2) * Math.cos(ang)) - ((hei / 2) * Math.sin(ang))
        let Top_RightY = centerY - ((wid / 2) * Math.sin(ang)) - ((hei / 2) * Math.cos(ang))

        //TOP LEFT VERTEX:
        let Top_LeftX = centerX - ((wid / 2) * Math.cos(ang)) - ((hei / 2) * Math.sin(ang))
        let Top_LeftY = centerY + ((wid / 2) * Math.sin(ang)) - ((hei / 2) * Math.cos(ang))

        //BOTTOM LEFT VERTEX:
        let Bot_LeftX = centerX - ((wid / 2) * Math.cos(ang)) + ((hei / 2) * Math.sin(ang))
        let Bot_LeftY = centerY + ((wid / 2) * Math.sin(ang)) + ((hei / 2) * Math.cos(ang))

        //BOTTOM RIGHT VERTEX:
        let Bot_RightX = centerX + ((wid / 2) * Math.cos(ang)) + ((hei / 2) * Math.sin(ang))
        let Bot_RightY = centerY - ((wid / 2) * Math.sin(ang)) + ((hei / 2) * Math.cos(ang))
    
        return [Top_LeftX, Top_LeftY, Top_RightX, Top_RightY, Bot_RightX, Bot_RightY, Bot_LeftX, Bot_LeftY]
    }
    
  }