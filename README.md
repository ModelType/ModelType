# ModelType

Easy Data Models

---

### What is ModelType?

ModelType is a YAML based language for generating database schemas across different languages.

### What Databases does ModelType Support?

The current compilers are made for MongoDB, but new parsers can be added to expand for other databases.

### What Languages does ModelType Support?

Currently included is a compilier for Mongoose+Typescript, and a Java Wrapper for the native MongoDB package.

### What does ModelType code look like?

```yaml
Name: TestApp
Heads:
    Java: |
      package com.modeltype.test
Models:
    User:
        Schema:
          Name:
            Firstname: string
            Lastname: string
          Created: date
          LastLogin: date
          Email: string
          Password: string
```

### Why should you use ModelType?

Data Models are important to any application, whether it's a hobby project or an enterprise platform, you need to be sure that you store data consistently in your database. 

ModelType helps you ignore all of the boilerplate code for your language and focus on what's most important, your data. 

### How do you use ModelType?

Take a look inside the "examples" folder to see how things work!

### "ModelType doesn't support my language!"

It's not that it doesn't support it, it's that support hasn't been made for it yet. ModelType provides the low-level classes to help build a compiler engine pretty easily, making it trivial to write a compiler that will output to your language.

### How do I build my own compiler?

Just look at the how the included compilers work. But if you want an explanation, here's a short one.

Compilers consist of three parts, an **Engine**, it's **Type Determiners**, and the **Parser**.

The Engine is responsible for generating the model. It takes in the raw document and churns out the compiled code. It does this by generating the necessary namespaces, then passing each model into the Type Determiner.

The Type Determiner is responsible for converting the primitive type into the compiled type. Type Determiners can recurse, which allows for object nesting.

The Parser is responsible for the final code. It takes the raw document, passes it into the compiler, and retrieves the compiled data.

### "I've built an awesome compiler for my language"

Share it! You can either publish a contrib module, or submit a pull-request to add it to the main package. If you're an individual, I'd recommend publishing a contrib module, as you'd retain ownership of your code and it would be bound by the GNU GPL v3. 

If you're a commercial entity, please contact me for licensing.

### "Can I use this at my company?"

Yes, but think about donating. 

Donation doesn't necessarily mean money though, helping out with the development of ModelType also counts as donating to the project.

### "I want to include ModelType in my own package/software"

Go right ahead! Just be sure to abide by the conditions in the GNU GPL v3 License.

Is the license too restrictive for you? Contact me and we'll work out a license and terms that makes everyone happy!

