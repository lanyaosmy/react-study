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

type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;

type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr2 = ToArrayNonDist<string | number>;

//

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;

// 取Type中的属性，并把值都变成boolean
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

type Features = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<Features>;

type AllLocaleIDs = '1' | '2' | '3';
type Lang = 'en' | 'ja' | 'pt';

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;

type PropEventSource<Type> = {
  on(
    eventName: `${string & keyof Type}Changed`,
    callback: (newValue: any) => void,
  ): void;
};

/// Create a "watched object" with an `on` method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(
  obj: Type,
): Type & PropEventSource<Type>;

type a = IdLabel & NameLabel;

interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) {
    // Notice no error here
    return s.toLowerCase();
  }
}

class Base {
  name = 'base';
  greet() {
    console.log('Hello, world!');
  }
}

class Derived extends Base {
  name = 'derived';
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet();
d.greet('reader');

const b: Base = d;
// No problem
b.greet();
