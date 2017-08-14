---
layout: post
title:  "Introduction to generics and wildcards"
date:   2016-06-10 09:30:07
categories: Java
---

Typing Collections is not straightforward.

An individual Collection can hold elements of different types. However, you probably want to be able to retrieve the element and do something with it, in which case it is helpful for the Colleciton to contain one type, so you know the type of the element you retrieve.

In earlier versions of Java, to retrieve elements from the collection you used to have to cast the element you get from the Collection.

```
List list = new ArrayList();
list.add(new Integer(1));
list.add(new Integer(2));

.... // some time later

Integer el = (Integer) list.get(0); // Cast!
```

If you were careless enough and tried to cast to the wrong type, this can cause a runtime error.

Runtime errors are **bad**. They make it hard to trust your application will work in production. In an ideal world, all errors would be build errors - thus if your application compiled, you could be confident it works.

With arrays, casting is not required as you explicitly state the type the array holds.
e.g.

```
int[] arr = new int[10];
```

Arrays are *covariant*. Covariance means if X is subtype of Y, then X[] will also be subtype of Y[]. This seems quite reasonable. However, it means this kind of code compiles.

```
// Integer is a subclass of Object, so Integer[] is a subclass of Object[]
Object[] objects = new Integer[10];
objects[0] = "Hello World"; // String is a subclass of Object, so...uh oh.
```

You've implied a String is the same type as an Integer. This will compile, and then raise a runtime exception when you try and execute the code.

### How this applies to generics

Generics are a way of specifying the type a Collection holds, and were created to force these runtime errors to show themselves at build time.

The covarience of arrays allows some errors to hide until runtime, so we can't allow generics to be convariant. Instead, they are **invariant**. This means Collections containing related elements are not themselves related. For example, an ArrayList of Integers is not related to an ArrayList of Numbers, even though Integer is a subclass of Number. Think of the divorce lawyers associated with a couple. The two divorce lawyers do not have to mimic the same relationship as their clients.

The invariance allows for type safety at runtime, but makes some functionality a bit less intuitive. For example, say you have a `Fruit` class, which has the child classes `Banana`, `Orange`, `Apple`, all which have a `getPrice` function. You would like to be able to find the total cost of any List of Fruits.

One attempt could be:

```
int calculateTotalPrice(List<Fruit> fruits) {
	int totalPrice = 0;
	for (f : fruits) {
		totalPrice += f.getPrice();
	}
	return totalPrice
}
```

However if you try and do:
```
List<Orange> oranges = (new Orange(), new Orange);
calculateTotalPrice(oranges); // Compile error!
```
By entering a List of Oranges as a parameter into this function, you get a build error. Your List of Oranges is not a List of Fruit, nor is it a subclass of a List of Fruit.

Of course, since each Orange individually is a subclass of Fruit, you could define the Collection of Oranges to be a Collection of Fruit to begin with:
```
List<Fruit> oranges = (new Orange(), new Orange);
calculateTotalPrice(oranges); // This should compile
```
but the author couldn't think of a less contrite example.

This is where wildcards come in. They allow us to keep the intuitive behaviour from arrays, without losing the same type safety.

**Upper bound: the extends keyword.**

This is to indicate the Collection can contain the Class, or any subclass of.

e.g. For the Fruit class, instead you might want to try:
```
int calculateTotalPrice(List<? extends Fruit> fruits) {
	int totalPrice = 0;
	for (f : fruits) {
		totalPrice += f.getPrice();
	}
	return totalPrice
}
```

Now you can enter a List of Oranges, Bananas, or whatever other List of subclasses of Fruit.

**Lower bound: the super keyword.**

This is to indicate the Collection can contain the Class, or any parent Class of.

### Putting elements into collections
Consider if you have `List<? super Integer>`
This means at runtime, you are allowing a `List<Integer>`, `List<Number>` or `List<Object>`.
To all of these, it is safe to put in an element of type Integer, from the Substitution Principle. **Lower bounded generics allow the user to put elements into the Collection.**

If instead you have List<? extends Number>, you cannot add elements to the list in a type safe way at runtime. You could have `List<Integer>`, `List<Double>`, `List<Float>` and you clearly can't add the same elements to each of these lists. Thus the compiler stops any attempts to allow you to add to a collection with an upper bounded wildcard.

### Getting elements from collections
If you have List<? extends Number>, and you try and get an element from the collection, you know the parameter will always subclass Number. From the substitution principle, it is then valid to set the return type as Number.

If you instead have List<? super Integer>, your return type could be Integer, Number or Object. So the safe return type is Object. This might be a problem if you are expecting a value more specific than an Object.

### The unbounded wildcard
This appears in the form `List<?>` which is syntactic sugar for List<? extends Object> - i.e., any class. This means we cannot put any instances in this collection, as there is no type safe way of confirming this at runtime.


### Note on syntax:
```
public void saveAll(List<? extends Person> persons);
```

is the same as
```
public List<T extends Person> void saveAll(List<T> persons);
```

However, unless you need to refer to the wildcard parameter T (which you probably don't), then the first is cleaner.


