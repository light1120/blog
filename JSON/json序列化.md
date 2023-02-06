```
class TObj {
    a: string
    b: number

    constructor(a: string, b: number) {
        this.a = a
        this.b = b
    }

    toJSON() {
        return {
            a: Number(this.a),
            b: this.b,
        }
    }
}

const T1 = new TObj('1', 2)
const T2 = new TObj('2', 3)
const T3 = new TObj('3', 4)

const Mobj: Array<TObj> = [T1, T2, T3]

const fun = () => {
    Mobj.forEach(obj => {
        if (obj.a == '1') {
            ;(obj as any).c = { c: 'test' }
        }
    })
}

fun()
console.log('coupon', JSON.stringify(Mobj[0]))

```