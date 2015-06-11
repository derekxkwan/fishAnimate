# fishAnimate

An Angular.js app using SVGs I originally developed at the TLL Lab at Stony Brook University for Dr. Ivan Chase, a sociology professor at the university, to visualize chicken hierachies. These hierarchies are determined by events in which chickens establish dominance, such as pecks. My original app loaded in a csv which was converted to json via a php script (I've included it here as api.php), but I've skipped that step here. I've emulated this resulting json data with randomly generated data created by a python script (the data can be found in ex1.js and the python script can be found in genJson.py).

My app animates notation developed by Chase. The staff lines represent chickens while the arrows represent dominance-establishing events with the aggressor pointing to the aggressee. The dots at the bottom denote the resulting hierarchical structure from these events and are calculated by my app. The ordering of the lines represents the final hierarchy after all dominance-establishing events.

Why I call it fishAnimate as opposed to chickenAnimate is that because the original version was chickenAnimate and improvements were made to visualize a new set of data involving fish rather than chickens.
