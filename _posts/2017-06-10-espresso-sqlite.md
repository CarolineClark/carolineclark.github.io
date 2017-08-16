---
layout: post
title:  "Android: Modifying the SQLite DB in an Espresso test"
date:   2017-06-10 09:30:07
categories: Android
---

Sometimes you want to modify the db of the app, and then check the UI based on how it displays the items from the db.
Here are some snippets of code to use in your test class to modify your db.

Firstly - it's important your Activity doesn't launch automatically at the start of each test. This is because we (well, I) want to modify the db in the test, and the Activity will get confused if you modify the db from under its feet.

We can stop the activity launching automatically by setting the last param in the constructor `false` as below:

{% highlight java %}
@Rule
public ActivityTestRule<MainActivity> mActivityTestRule = 
    new ActivityTestRule<>(MainActivity.class, false, false);
{% endhighlight %}

Next, here is an example of a function to clear the database.

{% highlight java %}
private final Context mContext = InstrumentationRegistry.getTargetContext();
private final Class mDbHelperClass = YourDbHelper.class;
    
public void dropDatabase() throws Exception {
    SQLiteOpenHelper dbHelper = (SQLiteOpenHelper) mDbHelperClass
        .getConstructor(Context.class)
        .newInstance(mContext);
    dbHelper
        .getWritableDatabase()
        .delete("YOUR_TABLE_NAME", null, null);
}
{% endhighlight %}

Similarly, to insert data:

{% highlight java %}
private void insertSingleTask(ContentValues testValues) throws Exception {
    SQLiteOpenHelper dbHelper =
            (SQLiteOpenHelper) mDbHelperClass
                .getConstructor(Context.class)
                .newInstance(mContext);

    SQLiteDatabase database = dbHelper.getWritableDatabase();

    long firstRowId = database.insert(
            "YOUR_TABLE_NAME",
            null,
            testValues);

    assertNotEquals("Unable to insert into the database", -1, firstRowId);
    dbHelper.close();
}
{% endhighlight %}

If you want to use this in a test, you need to make your db changes first, and then call `launchActivity(null)` on your test rule:

{% highlight java %}
@Test
public void fabLaunchesAddTaskActivity() throws Exception {
    // Given
    dropDatabase();
    mActivityTestRule.launchActivity(null);

    // Test your UI!
}
{% endhighlight %}
