# TODO
- Allow for other users in sessions to see strokes in progress (indicators)
- Synchronise canvas after clearing backend
- Edit build script to detect changes in React app, build automatically
- Distinguish between permissions to view/edit sketch
- User organizations
- Automatically push changes in canvas to all viewers
- Fix panning to outside of boundaries, add background?

# In Progress
- Add new tool types
    - Shapes
    - Image insertion
    - Text
    - Charts/infographics
    
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