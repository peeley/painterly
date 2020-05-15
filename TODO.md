# TODO
- User organizations
- Automatically push changes in canvas to all viewers
    - possibly have others view stroke indicators - may not be performant
- Fix panning to outside of boundaries, add background?
- Bugfix - fill tool not properly assigning bytes to image data
- Make logout timer not so obnoxious/learn how authentication actually works lmao
- Add painting preview in home screen
- Split home screen into blade components
- Loading animation while strokes object is being downloaded/rendered
- Fix automatic canvas sizing to fit screen, have canvas visual size
  and programmatic size be different.
- TESTING!

# In Progress
- Add new users to painting when private
    - Create backend controller
    - Create form in options modal in /home
- JQuery really isn't cutting it even for simpler interactions like in
  the home page - maybe start working on React component
- Add new tool types
    - Shapes
    - Image insertion
    - Text
    - Charts/tables
    
# Done
- Draw on canvas w/ pen, see changes instantly
    - Edit color, width of stroke
- Undo/redo functionality, version history
    - Redraw canvas after undo/redo
    - Make sure undo then draw isn't fucked
- UI/UX overhaul *ongoing*
    - theming
    - keybinds/ergonomics
- Indicator/shadow for certain tools
- Make clearing screen an undo-able action *Note- didn't do, makes for worse
  user experience overall, feels like not what you'd predict.*
- Add backend & database
    - Save sketches to acct
    - User auth, accounts
- Utility bar at top to download sketch, share link, edit title, etc.
- Zoom in on, pan over sketch
    - Fix mouse coordinate offsets when zoomed
    - Zoom in at mouse location
    - Zoom hotkeys
    - Reset button zoom level to default, zoom level indicators
- Synchronise canvas after clearing backend
- Distinguish between permissions to view/edit sketch
- Edit build script to detect changes in React app, build automatically
    - add debug .env flag for debug printing
- Refactor `fetch` calls in React to use `axios`
- From home screen be able to delete painting, edit title, make private
- Make validators for user input - titles, etc.
