---
layout: post
title:  "Minecraft style controls in Unity (on Desktop)"
date:   2017-07-01 09:30:07
categories: Unity
---
To be explicit, the controls are:

 - WASD to move forwards, left, backwards and right.
 - Lock the mouse in the centre, and as the mouse moves, rotate the camera in the direction of the mouse movement.

To deal with the mouse movement:

{% highlight c# %}
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController3D : MonoBehaviour {

    public float speedH = 2.0f;
    public float speedV = 2.0f;

    private float yaw = 0.0f;
    private float pitch = 0.0f;

    CursorLockMode wantedMode;

    void Update () {
        if (wantedMode == CursorLockMode.Locked) {
            yaw += speedH * Input.GetAxis("Mouse X");
            pitch -= speedV * Input.GetAxis("Mouse Y");
            transform.eulerAngles = new Vector3(pitch, yaw, 0.0f);
        }

        if (Input.GetMouseButtonDown(0)) {
            wantedMode = CursorLockMode.Locked;
            SetCursorState();
        }

        if (Input.GetKeyDown(KeyCode.Escape)) {
            Debug.Log("escaping");
            Cursor.lockState = wantedMode = CursorLockMode.None;
            SetCursorState();
        }
    }
}
{% endhighlight %}
