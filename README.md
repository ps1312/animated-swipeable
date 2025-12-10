### Purpose

This project was created with the objective to practice animations and explore more about React Native's built in `Animated API`, specially on what "limitations" justifies going directly in favor of `Reanimated`.

Well, they indeed exist, one that stands out is that `useNativeDriver` (which allows the animations to run on the native UI thread) does not support animating the component's height or width. This is a big concern if you want to display **smooth, 60fps** animations because without this config all the animations code have to pass through the bridge, on every frame, and if the JS thread gets busy, the animation can freeze (see video below).

Other than that I've found out that the `Animated API` has nice features: spring animations, interpolation, running animations in parallel, sequence... It can be a good API for simple tasks. Responding to gestures with `PanResponder` is also good, and it's really straightforward. With `PanResponder` I was able to program the component swipe behaviors without problems.

#### Topics explored
- Gesture-driven animations
- Layout measurement
- Swipe interactions
- UX inspired by real apps
- Stress tests to verify animation smoothness

#### What it does?
- Creates an iOS-mail style swipe-to-delete component
- Moves the list item to the left on the X axis based on pan gestures
- Highlights the component while the swipe is in progress
- Snaps the component in multiple positions when touch stops
- Shows the delete button on partial swipe or trigger the action with a full swipe
- Handles horizontal and vertical gestures correctly so the FlatList doesn't move while the swipe is in progress
- Animates the delete icon with a nice fade and scale using interpolation
- Animates the icon width when swipe is full
- Animates the item height before deleting, giving a nice polished effect instead of just "removing" the component in one frame
- Triggers a soft vibration feedback when swipe is full

#### Videos

<table>
  <tr>
    <td align="center">Delete</td>
    <td align="center">Cancel</td>
    <td align="center">Nuclear Stress Test</td>
  </tr>
  <tr>
    <td>
      <video src="https://github.com/user-attachments/assets/09b0d9b9-b0aa-45b7-99d1-c8d2678bb54d" controls width="300">
      </video>
    </td>
    <td>
      <video src="https://github.com/user-attachments/assets/dfec9b38-d5b2-4b65-b72a-2420a9942352" controls width="300">
      </video>
    </td>
    <td>
      <video src="https://github.com/user-attachments/assets/52b806ec-c506-4448-aa27-461d19e1c355" controls width="300">
      </video>
    </td>
  </tr>
</table>

#### Next steps

The next project is to replicate this exact behavior using `Reanimated` and `React Native Gesture Handler`. This will result in a good comparison about both performance and available API's. The objective is to see 60fps animations without stuttering or freezing, even in the Nuclear Stress Test ✅.

#### References:

- https://reactnative.dev/docs/animated
- https://reactnative.dev/docs/panresponder
