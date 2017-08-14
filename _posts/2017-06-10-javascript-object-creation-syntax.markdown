---
layout: post
title:  "Memo to self - the many syntaxes for creating Objects"
date:   2016-06-24 09:30:07
categories: Javascript
---
 - Note: this is heavily based off the Jim Cooper lectures on PluralSight.
 
#Option 1 - Object literals, upfront
```
var dog = {
    name: "Bruno", 
    size: "small",
    speak: function() {
        console.log("Woof!");
    }
};
```
#Option 2 - Object literals, in hindsight
```
var dog = {};
dog.name = "Bruno", 
dog.size = "small",
dog.speak = function() {
    console.log("Woof!");
}
```

#Option 3
```
function Dog(name, size) {
    this.name = name;
    this.size = size;
    this.speak = function() {
        console.log("Woof!");
    }
}
var dog = new Dog("Bruno", "small");
```
#Option 4 - ECMAScript
```
class Dog() {
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }

    speak() {
        console.log("Woof!");
    }
}

var dog = new Dog("Bruno", "small");
```

The different syntaxes for creating Objects are all syntactical sugar for the following:
```
var dog = Object.create(Object.prototype, 
{
    name: {
        value: "Bruno",
        enumerable: true,
        writable: true,
        configurable: true
    },
    size: {
        value: "small",
        enumerable: true,
        writable: true,
        configurable: true
    }
})
```


You can see the keys `writable`, `enumerable` and `configurable` here. What do they all mean?

# Writable
This determines whether you can change the property.
Consider the following:

```
'use strict'
var cat = {
    name: {first: 'fluffy', last: 'queen'},
    color: 'white'
}
Object.defineProperty(cat, 'color', {writable: 'false'});
cat.color = 'red'; // Error!
console.log(cat.color);  // white
```
Because we set the cat.color property to writable = false, we've fixed the pointer the property is pointing to.
Be aware that this won't throw an error unless you have `'use strict` at the top.
That also means that the following will work:
```
'use strict'
var cat = {
    name: {first: 'fluffy', last: 'queen'},
    color: 'white'
}
Object.defineProperty(cat, 'name', {writable: 'false'});
cat.name.first = 'mac';
console.log(cat.name.first);  // mac
```
Why did this work? We've fixed the pointer for cat.name, but that doesn't automatically mean we've fixed the values within that. If you want the whole object to be readonly:
```
'use strict'
var cat = {
    name: {first: 'fluffy', last: 'queen'},
    color: 'white'
}
Object.defineProperty(cat, 'name', {writable: 'false'});
Object.freeze(cat.name);
cat.name.first = 'mac'; // Error!
console.log(cat.name.first);  // fluffy
```

#Enumerable
When set to true, allows the property:
 - to show up in for loops
 - to show up in the object keys
 - to be serialised into json

```
'use strict'
var cat = {
    name: {first: 'fluffy', last: 'queen'},
    color: 'white'
}

Object.defineProperty(cat, 'name', {enumerable: 'false'});
console.log(Object.keys(cat)); // color: white
console.log(JSON.stringify(cat)); // {"color": "white"}
```
Note - you can still access the property, but only if you know to look for it directly.

#Configurable
When set to false, this stops:
- the enumerable property from being changed.
- the configurable property from being changed back to true.
- any property from being deleted.
However you can still change the writable property to true/false.

# Getters and setters
An example:
```
var cat = {
    name: {
        first: "Fluffy", "last": "Queen"
    },
    color: "White"
}

Object.defineProperty(cat, 'fullName',
    {
        get: function() {
            return this.name.first + " " + this.name.last;
        },
        set: function(value) {
            var nameParts = value.split(" ");
            this.name.first = nameParts[0];
            this.name.last = nameParts[1];
        }
    }
)

cat.fullName = "Muffin top"; // this is calling 'set("Muffin top")'
console.log(cat.fullName); // "Muffin top"
console.log(cat.name.first); // "Muffin"
console.log(cat.name.last); // "top"
```
https://zeekat.nl/articles/constructors-considered-mildly-confusing.html
