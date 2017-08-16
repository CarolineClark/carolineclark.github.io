---
layout: post
title:  "Memo to self - Javascript, \"this\" and \"new\""
date:   2017-07-02 09:30:07
categories: Javascript
---

When creating an object, one syntax you can use is the `new` keyword on a function.
{% highlight javascript %}
function Dog() = {
    this.sound = "Woof";
}

var dog = new Dog();
{% endhighlight %}

If you remove the word `new`, it changes its meaning completely, and that's because of how `new` changes the meaning of `this`.

By default, `this` refers to the global variable `window`, representing the browser window. When you use `new`:

 - a new Object is created
 - `this` is assigned to the new Object in the scope of the function
 - the return value of the function becomes the Object.

So if you removed the `new` keyword, i.e.:
{% highlight javascript %}
function Dog() = {
    this.sound = "Woof";
}

var dog = Dog();
{% endhighlight %}

`dog = undefined`, and `window.sound = "Woof"`.
