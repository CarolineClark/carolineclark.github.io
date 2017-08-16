---
layout: post
title:  "Introduction to Generics and Wildcards in Java"
date:   2016-06-10 09:30:07
categories: Java
---

Typing Collections in Java is not straightforward.

An individual Collection can hold elements of different types.

{% highlight java %} 
// This is valid
List list = new ArrayList();
list.add(1);
list.add("myname");
{% endhighlight %}

However at some point, you'll probably want to be able to retrieve the element and do something with it. And if your Collection contains many different types, you'll end up with code that looks like:

{% highlight java %} 
for (Object o: list){
	if (o instanceof String) {
		String s = (String) o;
		// do something with the String
	} else if (o instanceof Integer) {
		Integer i = (Integer) o;
		// do something with the Integer
	}
} 
{% endhighlight %}

This is quite cumbersome. I don't want to check for each Object type when I retrieve an item.

Often it is more helpful for the Collection to contain only one type.

In earlier versions of Java, to retrieve elements from the collection, you had to cast the element you get from the Collection.

{% highlight java %}
List list = new ArrayList();
list.add(new String("Bob"));
list.add(new String("Ann"));

.... // some time later

String el = (String) list.get(0); // Cast!
{% endhighlight %}

This is better. But say this list contains data to display on a form. Your colleague decides they want to display some numbers on the form:

{% highlight java %}
Integer age = new Integer(4);
list.add(age);
{% endhighlight %}

Your colleague has now created the most evil of all exceptions - the Runtime Exception. And they are probably clueless about it.

The problem with Runtime Exceptions is that are silent up until they strike. Your compiler, and thus your IDE, is unable to detect them, and so it is up to fickle humans to protect against them. Often this is with a lot of manual testing. **In an ideal world, all errors would be compile time errors.** Thus, if your program compiles, you could be confident it wouldn't crash.

It's easy to blame your colleague for the mistake. But what if the Cast is buried in a load of spaghetti code? What if no one has touched this code for 6 years? What if there are no test cases? 

It would be better to write this code such that Runtime Exceptions can't happen.

### How to arrays compare?

Arrays are much lower level than Collections, and come with far less bells and whistles. With arrays, casting is not required as you explicitly state the type the array holds:

{% highlight java %}
int[] arr = new int[10];
{% endhighlight %}

Arrays are *covariant*, which means if X is subtype of Y, then X[] will also be subtype of Y[]. This seems quite reasonable. However, it means this kind of code compiles.

{% highlight java %}
// Integer is a subclass of Object, so Integer[] is a subclass of Object[]
Object[] integerArray = new Integer[10];
integerArray[0] = "Hello World"; // String is a subclass of Object, so...uh oh.
{% endhighlight %}

You've implied a String is the same type as an Integer. Thus this will compile, and then raise a Runtime Exception when you try and execute the code. 

So we don't have type safety in arrays either.

### Generics - type safety in Collections

Generics are a way of specifying the type a Collection holds, and were created to make these Runtime Exceptions show themselves at compile time.

The covarience of arrays hides some Runtime Exceptions, so we can't allow Generics to be convariant. Instead, they are **invariant**. This means Collections containing related elements are not themselves related. For example, an ArrayList of Integers is not a subclass of an ArrayList of Numbers, even though Integer is a subclass of Number. Think of the divorce lawyers associated with a couple. The two divorce lawyers do not have to mimic the same relationship as their clients.

The invariance allows for type safety at runtime, but makes some functionality a bit less intuitive. For example, say you have a `Fruit` class, which has the child classes `Banana`, `Orange`, `Apple`, all which have a `getPrice()` function.

{% highlight java %}
class Fruit {
	public double getPrice() {
		return 1; // default
	}
}

class Orange extends Fruit {
}

// etc

{% endhighlight %}

 You would like to be able to find the total cost of any List of Fruits.

One attempt could be:

{% highlight java %}
int calculateTotalPrice(List<Fruit> fruits) {
	int totalPrice = 0;
	for (Fruit f : fruits) {
		totalPrice += f.getPrice();
	}
	return totalPrice
}
{% endhighlight %}

However if you try and do:

{% highlight java %}
List<Orange> oranges = (new Orange(), new Orange());
calculateTotalPrice(oranges); // Compile error!
{% endhighlight %}

By entering a List of Oranges as a parameter into this function, you get a build error. Your `List<Orange>` is not a subclass of a `List<Fruit>`.

Of course, since each Orange individually is a subclass of Fruit, you could define the Collection of Oranges to be a Collection of Fruit to begin with:

{% highlight java %}
List<Fruit> oranges = (new Orange(), new Orange);
calculateTotalPrice(oranges); // This should compile
{% endhighlight %}

....but then, should you want to do something specific to each Orange element, you'll have to go back to casting....so this isn't ideal.

### Wildcards, an alternative to covariance

This is where wildcards come in. They allow us to keep the intuitive behaviour from arrays, without losing the same type safety.

**Upper bounded generics: the extends keyword.**

This is to indicate the Collection can contain any subclass.

e.g. For the function above, instead you might want to try:
{% highlight java %}
int calculateTotalPrice(List<? extends Fruit> fruits) {
	int totalPrice = 0;
	for (Fruit f : fruits) {
		totalPrice += f.getPrice();
	}
	return totalPrice
}
{% endhighlight %}

Now you can enter a `List<Orange>`, `List<Banana>`, or whatever other List of subclasses of Fruit.

You can think of using the upper bound as making the elements of the collection readonly.

{% highlight java %}
int calculateTotalPrice(List<? extends Fruit> fruits) {
	// this is valid from the substitution principle
	Fruit fruit = fruits.get(0);
}
{% endhighlight %}

We can see that casting to a Fruit is valid for all subclasses of Fruit, which is why this works for reading elements from the array.

However, say we use the same wildcard, and try and add something to the collection (e.g. an Apple).

{% highlight java %}
// This will not compile!
void addApple(List<? extends Fruit> fruits) {
	fruits.add(new Apple());
}
{% endhighlight %}

This code will not compile, as it implies that you should be able to pass in a `List<Orange>`...and clearly adding an Apple to a `List<Orange>` doesn't make sense. So we have to use a different wildcard when putting elements in the list.

**Lower bounded generics: the super keyword.**

This is to indicate the Collection can contain the Class, or any parent. Consider the following:
{% highlight java %}
void addApple(List<? super Apple> apples) {
	fruits.add(new Apple());
}
{% endhighlight %}

This makes more sense. At runtime, you are allowing the following as arguments: `List<Apple>`, `List<Fruit>` or `List<Object>`. To all of these, it is safe to put in an element of type Apple, from the Substitution Principle. **Lower bounded generics allow the user to put elements into the Collection.**

### The unbounded wildcard
This appears in the form `List<?>` which is syntactic sugar for `List<? extends Object>` - i.e., any class. This is useful when we want to use collection methods that are independant of the type. 
From the reasoning above, it does mean we cannot put any instances in this collection, as there is no type safe way of confirming it will run.


### Note on syntax:
{% highlight java %}
public void saveAll(List<? extends Person> persons);
{% endhighlight %}

is the same as
{% highlight java %}
public List<T extends Person> void saveAll(List<T> persons);
{% endhighlight %}

However, unless you need to refer to the wildcard parameter T (which you probably don't), then the first is cleaner.


