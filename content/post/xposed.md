---
title: "Android runtime hacking with Xposed"
date: 2016-01-02T23:42:00+02:00
draft: false
---

I was wondering how the Android runtime was working and if we can hack it to make it execute custom code. It turns out that there is a tool that does the job for you, Xposed. It's a framework that allows to tweak on-the-fly the Android runtime.

<!--more-->

# Nuit de l'Info

Recently, I gave a talk about that subject in Paris during a french event called [La Nuit de l'Info](http://www.nuitdelinfo.com/). You can watch it on [YouTube](https://www.youtube.com/watch?v=DDF70hg8WY8) and review [my slides](https://pool.obyn.io/impress/xposed/). 

{{< youtube DDF70hg8WY8 >}}


# Explain me like I'm five

Basically, Xposed allows you to run some custom code before and after any functions. It's a process called hooking. No APK is modified, all the changes take place in memory. Of course, Android does not allow such an operation natively and you must install the Xposed framework on your device. 

But how Xposed manage to do such a thing ? This is the same principle as the Greek Trojan horse, which is, for those who hate history, a subterfuge that the Greeks used to enter the city of Troy and win the war. The Greeks constructed a huge wooden horse, and hid a select force of men inside. 

The Greeks pretended to sail away, and the Trojans pulled the horse into their city as a victory trophy. That night the Greek force crept out of the horse and opened the gates for the rest of the Greek army, which had sailed back under cover of night.

# Under the hoods

Let's explain how Xposed works. While starting, Android will go through several stages : Bootloader, Kernel, Init.. This latter is in charge of starting the daemons of the system. One of these daemons, called Zygote, is launched by the app_process binary and it's where things began to get very unique and interesting. 

Its name is a fun reference to a biological process: "It is the initial cell formed when a new organism is produced". Indeed, Zygote is a daemon whose goal is to launch apps and consequently is the parent of any Android process. Zygote creates a Dalvik machine during startup and loads all necessary Java classes and resources. Then when an app starts, it creates a "fork" of that Dalvik machine and runs the app inside. 

Thus, the applications are partitioned from each other, which improves the security and the memory management. The aim of Xposed is to launch a custom app_process binary which contains a custom jar that allows us to the java reflection. Then you just won the war. You're now able to hook any function of the Android API.

# How to use it ?

While developing with Xposed, the first thing you need to know is what you want to change. For example, let's say we want to modify the color of the Android clock. In order to achieve this, we must browse the AOSP code in order to check which function interacts with the clock. [This function](https://github.com/aosp-mirror/platform_frameworks_base/blob/master/packages/SystemUI/src/com/android/systemui/statusbar/policy/Clock.java#L201) seems quite interesting, let's hook it :)

```java
final void updateClock() {
    mCalendar.setTimeInMillis(System.currentTimeMillis());
    setText(getSmallTime());
}
```

Firstly, you need to make some tweaks. In your new Android project, you need to include the Xposed jar and declare it in the manifest. I let you check [the documentation](https://github.com/rovo89/XposedBridge/wiki/Development-tutorial) for that. 

Then you need to handle the process. In our case, we will handle the com.android.systemui.process and then we will hook the clock method to change the clock color.

```java
@Override
public void handleLoadPackage(LoadPackageParam lpparam) throws Throwable {
	if (!lpparam.packageName.equals("com.android.systemui"))
		return;

	XposedBridge.log("We are in SystemUI!");

	findAndHookMethod("com.android.systemui.statusbar.policy.Clock", lpparam.classLoader, "updateClock", new XC_MethodHook() {
		@Override
		protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
			// this will be called before the clock was updated by the original method
		}
		@Override
		protected void afterHookedMethod(MethodHookParam param) throws Throwable {
			TextView clock = (TextView) param.thisObject;
            clock.setTextColor(Color.CYAN);
		}
	});
}
```

Then you can run the app on your device, assuming you have installed the Xposed framework. Don't forget to enable it in the Xposed settings and to reboot the device after that.