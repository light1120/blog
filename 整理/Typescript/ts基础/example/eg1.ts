let person: string = 'zhangsan'
let age: number = 18
function greeting(person: string): string {
    return `hello , ${person}`
}

const a: bigint = 123n

const b = a * 10n

const arr: Array<number> = [1, 2, 3]

const obj: object = [1, 2, 3]

type T1 = Parameters<never>;


type T2 = ReturnType<(s: string, t: number) => void>;

var t2: T2 = undefined

const tt2: null = null

type T12 = NonNullable<string | number | undefined>;

type T112 = string | number | undefined | null | void
type T113 = T112 & {}
type T4 = NonNullable<string | number | undefined | null>

type T5 = ConstructorParameters<ErrorConstructor>;
type T6 = InstanceType<ErrorConstructor>



type Point = { x: number; y: number };
type P = keyof Point;
const p1: P = 'x'
type Mapish = { [k: string]: unknown };
type M = keyof Mapish;

type MyKeyof<T> = T extends Record<(infer TypeKeyOf), any> ? TypeKeyOf : never
type MyKeyof2<T> = T extends { [K in infer TypeKeyOf]: any } ? TypeKeyOf : never
type mykeyof = MyKeyof<Point>
type mykeyof2 = MyKeyof2<Mapish>

type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];

type I1 = Person["age" | "name"];

type I2 = Person[keyof Person]

const MyArray2 = [
    { name: "Alice", age: 15 },
    { name: "Bob", sex: 'male' },
];
type sArr = Array<string>
type Person2 = typeof MyArray2[number];

type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.
type Str = Flatten<string[]>;

// type Str = string

// Leaves the type alone.
type Num = Flatten<number>;

// type Num = number



declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
declare function stringOrNum(x: string): number;

type T11 = ReturnType<typeof stringOrNum>;

type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr = ToArray<string | number>;

type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
type ArrOfStrOrNum = ToArrayNonDist<string | number>;
// type ArrOfStrOrNum = (string | number)[]

type MyPatrial<Type> = {
    [Key in keyof Type]?: Type[Key]
}
type PatrailPerson = MyPatrial<Person>
type PatrailPerson2 = Partial<Person>

type MyRequired<Type> = {
    [Key in keyof Type]-?: Type[Key]
}

type RequiredPerson = MyRequired<PatrailPerson>


type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

type LazyPerson = Getters<Person>;

type An = 'A1' | 'A2'
type Bn = 'B1' | 'B2'
type Cn = `${An | Bn}_C`
type Dn = 'D1' | 'D2'
type En = `${Cn}_${Dn}`

type Greeting = "Hello, world"
type upperGreeting = Uppercase<Greeting>

type Greeting2 = "HELLO, WORLD"
type lowerGreeting = Lowercase<Greeting2>

type Greeting3 = "hello, world"
type capGreeting = Capitalize<Greeting3>

type Greeting4 = "HELLO, WORLD"
type unCapGreeting = Uncapitalize<Greeting4>

function identity<T>(arg: T): T {
    return arg;
}
identity<string>('1')
identity<number>(1)



interface GenericIdentityFn<T> {
    (arg: T): T;
}
function myIdentity<T>(arg: T): T {
    return arg;
}
let myIdentity1: GenericIdentityFn<number> = myIdentity
let myIdentity2: GenericIdentityFn<string> = myIdentity
myIdentity1(1)
myIdentity2('1')

// Property 'zeroValue' has no initializer and is not definitely assigned in the constructor.ts(2564)
// strictPropertyInitialization : false
class GenericNumber<NumType> {
    zeroValue: NumType;
    add: (x: NumType, y: NumType) => NumType;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) {
    return x + y;
};

function identityNumber<T extends number>(arg: T): T {
    return arg;
}
identityNumber<number>(1)

interface Animal {
    name: string;
}
interface Animal {
    weight: number;
}

const bear: Animal = {
    name: 'bear',
    weight: 100,
}

let aElement: any

aElement = 'a' as string

let symbolA: symbol = Symbol('asd1')
let symbolB: symbol = Symbol('asd')

let numberA: 1 = 1
numberA = 1

type TupleB = [string, number, boolean?]
let tupleB: TupleB = ['1', 0]


enum Direction {
    Up,
    Down,
    Left = 'three',
    Right = 'for',
}

Direction.Up

enum YesOrNo {
    Yes = "yes",
    No = "no",
}

YesOrNo.No

enum Numbers {
    ONE = 1,
    TWO,
    THREE = 1,
    FOR,
    FIVE
}

