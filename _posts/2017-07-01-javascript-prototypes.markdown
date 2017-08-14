---
layout: post
title:  "Memo to self - javascript prototypes"
date:   2017-07-01 09:30:07
categories: Javascript
---
```
A function's prototype is the object instance that will become the prototype for all objects created using this function as a constructor
```
```
An object's prototype is the object instance from which the object is inherited.
```

A prototype is not like a class, it is an object. 

When a function is created, a prototype object is created and attached to it behind the scenes. If the function is then used as a constructor with the `new` keyword, the object that is created has a __proto__ property that is pointing to the same object that is the function's prototype. 

To illustrate:
```
function Cat(name, age) {
    this.name = name;
    this.age = age;
}
var fluffy = new Cat("fluffy", "3");

console.log(fluffy.__proto__ === Cat.prototype);
```

`fluffy.__proto__` is pointing to the same instance as `Cat.prototype`. To continue:

```
Cat.prototype.greeting = "hi!";
console.log(fluffy.__proto__.greeting); // "hi!"
```

This also affects any new instance created:
```
var bob = new Cat("bob", "4");
console.log(bob.__proto__.greeting); // "hi!"
```

Due to the way javascript works, we can also access these new properties as though they are on the object itself.
```
console.log(fluffy.greeting); // "hi!"
console.log(bob.greeting); // "hi!"
```

This is a bit weird, especially when you consider the following.
```
console.log(fluffy.hasOwnProperty("greeting")); // false
```

When you query an instance for a property in Javascript, if the property does not have the property on it, the property is then checked for on its prototype. If the instance has the property though, then this recursive search stops early:

```
fluffy.greeting = "Purrr";
console.log(fluffy.hasOwnProperty("greeting")); // true
console.log(fluffy.greeting); // "Purrr"
```

You can change the prototype object on the constructor, although it can give some weird side effects:

```
function Cat(name, age) {
    this.name = name;
    this.age = age;
}
Cat.prototype.greeting = "Meow";

var fluffy = new Cat("fluffy", "3");
var muffin = new Cat("muffin", "5");

Cat.prototype = {greeting: "Rawr"};
var snowball = new Cat("snowball", 10);

console.log(fluffy.greeting); // "Meow"
console.log(muffin.greeting); // "Meow"
console.log(snowball.greeting); // "Rawr"
```

The existing fluffy and muffin objects still have prototypes pointing to the original function prototype instance.
This emphasises the prototypes are all instances of objects living in memory.

#Down the rabbit hole.
What we haven't seen yet is that the Cat prototype also has a prototype.
```
console.log(fluffy.__proto);  // Cat {greeting: "Meow"}
console.log(fluffy.__proto__.__proto__);  // Object {}
console.log(fluffy.__proto__.__proto__.__proto__);  // null
```
By default, all objects in Javascript inherit from Object, and Object's prototype is null.

# Inheritance
```
function Animal(voice) {
    this.voice = voice;
}
Animal.prototype.speak = function() {
    console.log(this.voice || "Grunt");
}

function Cat(name, color) {
    Animal.call(this, 'Meow');
    this.name = name;
    this.color = color;
}

Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;

var fluffy = new Cat("fluffy", "white");
fluffy.speak(); // "Meow"
```

Why use `Object.create`? `Object.create` sets up the prototype chain and assigns Animal.prototype as the prototype for Cat.


Alternative syntax:
```
class Animal {
    constructor(voice) {
        this.voice = voice || "Grunt";
    }

    speak() {
        console.log(this.voice);
    }
}

class Cat extends Animal {
    constructor(name, color) {
        super("Meow");
        this.name = name;
        this.color = color;
    }
}

var fluffy = new Cat("fluffy", "white");
```

There are some differences between these, the most important being that the `speak` function is no longer enumerable.
