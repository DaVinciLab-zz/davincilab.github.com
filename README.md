##Information
**Title:**  DMRI information Drawing study  
**Principle Investigator:** UMBC--DaVinci Lab (Dr. Chen)

##Introduction

Welcome. Thanks for participating in our study. By taking part in this study, you creative design will guide us the design of visualization method. Please note that you design will be treated seriously and think twice before drawing. The study includes three parts:   
  1. Training;  
  2. Formal experiment;  
  3. Questionnaire;
Please visit [http://davincilab.github.io/](http://davincilab.github.io/) to have a look.
   
###Training 
**Important: You brownser should support WebGL, You could open *[http://get.webgl.org/](http://get.webgl.org/)* to have a test. You should see a spinning cube. If you do not, please visit the [support site](https://support.google.com/chrome/answer/1220892) for your browser.**   
####Sescription
What you will see today is a [diffusion tensor MRI](http://en.wikipedia.org/wiki/Diffusion_MRI) or [DTI](http://en.wikipedia.org/wiki/Diffusion_tensor_imaging#Diffusion_tensor_imaging) visualization. DTI is an in-vivo MRI technique that measures the motion of water molecules. The technique can be used to study the connectivity of brain regions and distribution of neuro-pathways. The pathways can be represented using a technique called DTI tractography, each tract representing water molecules in motion along the main direction. You can see the picture: ![tesla for DTI measure](https://github.com/DaVinciLab/davincilab.github.com/blob/master/html-images/tesla_for_DTI_measure.jpg?raw=true), !['ellipsoid tensor shapes'](https://github.com/DaVinciLab/davincilab.github.com/blob/master/html-images/ellipsoid_tensor_shapes.jpg?raw=true), !['DMRI tractography'](https://github.com/DaVinciLab/davincilab.github.com/blob/master/html-images/DMRI_tractography.png?raw=true).
    
In biomedicine, different anatomical region are named.Different fiber bundles follow different directions. From the whole dataset (see the upper right picture), we just pick up 5 major fiber bundles:
      
   * [Corpus callosum or CC](http://en.wikipedia.org/wiki/Corpus_callosum); 
   * [Cingulum or CG](http://en.wikipedia.org/wiki/Cingulum_%28brain%29);
   * [Corticospinal tract or CST](http://en.wikipedia.org/wiki/Lateral_corticospinal_tract); 
   * [Inferior frontaloccipital fasciculus, or IFO](http://en.wikipedia.org/wiki/Inferior_longitudinal_fasciculus);
   * [ILF (inferior longitudinal occipitotemporal fasciculus, anterior to posterior)](http://www.ncbi.nlm.nih.gov/pubmed/22617176).
        
####Interaction
  
Please Open The [Training WebSite](http://davincilab.github.io/brainTractography_Training.html) Now!  
When you open the website, you will see a 3D brain model. You can rotate the model by left-mouse dragging and zoom in or out by the “wheel” the mouse, Please try it now.  

The **corpus callosum or CC(colored with 'Red')** is the only bundle that connects the left and right hemispheres. In the picture, **CG(colored with 'Green')** is the green bundle sitting right on top of corpus callosum. It is also very thin. The **cortocospinal tract or CST (in blue)** has a fan shape. The last two fiber bundles of **IFO(in yellow)** and **ILF(in cyan)**. It is easy to confuse these two, because they originate from the same anatomical regions. ILF goes all the way from anterior to posterior, while IFO turns to the lateral direction. Also note that this person is normal but one side of the IFO is missing (perhaps due to the low-resolution sampling).
All tasks that you will be performing will be related to these five bundles only.   
####Task Simple Task Description
Our study focus on “artist line drawing to convey X information”, where X could be depth, FA, or whatever information we care. So this is the most important thing that your drawing should convey X information in each task. After your finish each drawing, you should depict “How your drawing convey X information” as clear as possible in the questionnaire.
