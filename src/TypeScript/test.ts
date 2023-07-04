type Person = { age: number; name: string; alive: boolean };
type Age = Person['age']; //number
type I1 = Person['age' | 'name']; // number | string
type I2 = Person[keyof Person]; // string | number | boolean
type AliveOrName = 'alive' | 'name';
type I3 = Person[AliveOrName]; // string | boolean

const MyArray = [
  { name: 'Alice', age: 15 },
  { name: 'Bob', age: 23 },
  { name: 'Eve', age: 38 },
];

type Person1 = (typeof MyArray)[number];

type Age1 = (typeof MyArray)[number]['age'];

type Age2 = Person1['age'];

type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;

type Point = { x: number; y: number };
type P = keyof Point;

type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // JavaScript对象键始终被强制转换为字符串

interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  console.log('idOrName', idOrName);
  throw 'unimplemented';
}

// type MessageOf<T> = T['message']; // Type '"message"' cannot be used to index type 'T'.
// 改成
type MessageOf1<T extends { message: unknown }> = T['message'];

type MessageO2f<T> = T extends { message: unknown } ? T['message'] : never;

type Flatten<T> = T extends any[] ? T[number] : T;

type Flatten1<Type> = Type extends Array<infer Item> ? Item : Type;

type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;

type Num1 = ReturnType<() => number>;

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;

type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
