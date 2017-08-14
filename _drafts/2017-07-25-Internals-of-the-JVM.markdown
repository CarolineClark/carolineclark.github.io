---
layout: post
title:  "Internals of the JVM"
date:   2017-07-25 09:30:07
categories: Java
---

Things I learnt:
 - People saying Java is slow is completely unfounded. The JIT compiler is very good at optimising code, to the point where it is comparable to C++ code.
 - javac does very little optimisations on the code. Most of it is done with the JIT (Just In Time compiler).
 - Because of how little javac does to optimise, fully compiled code actually is slower than the code using the JIT. This is because of the many optimisations JIT adds on top of the code.
 - There is an application called JITWatch to help you monitor what happens to your code after it is compiled.

 Example optimsations:
 - When Java encouraged people to use StringBuilder, they found no one really paid attention, and continued to use `"blah " + variable` to create their strings. So, now, this is done in the compiler.
 - Objects are always allocated on the heap right? Well, the java compiler (from 1.6.40?) uses escape analysis to see whether the object reference leaves the function. If not, then the object can be allocated on the stack, resulting in about 25% faster code.
 
 Side note: these optimisations don't include Android. Google's Android Runtime (ART). ART compiles entire applications into native machine code upon their installation.
 