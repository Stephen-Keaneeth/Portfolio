# Building MediScan AI --- An AI-Powered Medical Image Diagnostic Prototype

During a recent hackathon, my team and I built **MediScan AI**, a
prototype platform that explores how deep learning can assist in
analyzing medical images such as X-rays, MRIs, CT scans, dermatology
images, and retinal scans.

The goal of this project was not to build a clinically deployable
system, but to design a **modular AI architecture** that can be extended
with multiple medical imaging models and deployed through a clean web
interface.

This article documents the **architecture, design decisions, and lessons
learned while building MediScan AI.**

------------------------------------------------------------------------

# 🚀 The Idea

Medical imaging plays a critical role in diagnosis. However,
interpreting scans requires expertise and time.

With recent advancements in deep learning, convolutional neural networks
(CNNs) have shown strong performance in image classification tasks ---
including medical imaging.

The idea behind **MediScan AI** was to create a system that:

-   Accepts different types of medical scans
-   Runs AI-based image classification
-   Displays possible conditions with probabilities
-   Provides a clean interface for demonstration

Rather than building a single-purpose model, we designed the system to
be **modular and extensible**.

------------------------------------------------------------------------

# 🧠 Core Architecture

The system follows a clean pipeline architecture:

User Upload → Image Preprocessing → Model Loader → Diagnostic Engine →
Streamlit Interface

Each component was separated into its own module to keep the system
maintainable.

------------------------------------------------------------------------

# 🖥️ User Interface

The application frontend is built using **Streamlit**, which allowed us
to rapidly prototype an interactive interface.

The UI supports:

-   Uploading medical images
-   Selecting scan type
-   Running AI inference
-   Displaying diagnosis predictions
-   Showing probability distributions

The interface also includes a technical panel showing:

-   Model backbone
-   Device used (CPU/GPU)
-   Number of classes
-   Input resolution

This makes the platform useful for both **demonstration and
experimentation.**

------------------------------------------------------------------------

# 🧩 Modular Model Registry

One design goal was making it easy to plug in new disease detection
models.

Instead of hardcoding models, the system uses a **central registry**
where each scan type defines:

-   Model backbone
-   Number of output classes
-   Disease labels
-   Optional fine‑tuned weights

This approach allows the system to **automatically detect and load new
models** when they are added.

------------------------------------------------------------------------

# 🔬 Image Preprocessing Pipeline

Medical images can come in many formats and color spaces. To handle this
variability, the system includes a preprocessing module that prepares
images before inference.

Key preprocessing steps include:

-   Handling RGBA, grayscale, and RGB images
-   Converting grayscale scans into 3-channel format
-   Resizing images to model input size (224×224)
-   Normalizing with ImageNet statistics

Each scan type can have its own preprocessing configuration.

------------------------------------------------------------------------

# ⚙️ Diagnostic Engine

The **DiagnosticEngine** acts as the central inference controller.

Its responsibilities include:

-   Loading models on demand
-   Caching models to avoid repeated loading
-   Running inference with PyTorch
-   Converting logits to probability distributions
-   Sorting predictions by confidence

The engine returns a structured result containing:

-   Predicted condition
-   Confidence score
-   Ranked class probabilities
-   Model backbone
-   Device used

------------------------------------------------------------------------

# 🧪 Supported Scan Types

The prototype currently supports several scan categories:

-   Chest X‑Ray
-   Brain MRI
-   Chest / Abdomen CT
-   Skin Lesion
-   Retinal Fundus

Each category can classify multiple diseases relevant to that modality.

The models currently rely on **ImageNet pretrained weights**, making
them suitable for demonstration but not for clinical use.

------------------------------------------------------------------------

# 📦 Tech Stack

The system is built using:

-   Python
-   PyTorch
-   TorchVision
-   Streamlit
-   Pillow
-   NumPy

------------------------------------------------------------------------

# 🧠 Key Design Decisions

### Modular AI Architecture

Each component (UI, preprocessing, model loading, inference) was
separated into its own module.

### Model Registry Pattern

New medical AI models can be added without modifying the rest of the
system.

### Lazy Model Loading

Models load only when needed, improving performance.

### Extendable Scan Types

Adding a new scan type requires only configuration entries.

------------------------------------------------------------------------

# ⚠️ Disclaimer

MediScan AI is a **research prototype created during a hackathon**.

The models currently use pretrained weights and have **not been trained
on clinical datasets**, meaning predictions are not medically validated.

The project is intended to demonstrate **AI architecture and system
design**, not to provide real medical diagnoses.

------------------------------------------------------------------------

# 📚 What I Learned

Working on MediScan AI was a great learning experience. Some key
takeaways were:

-   Designing modular ML systems
-   Integrating PyTorch models with web interfaces
-   Building extensible AI pipelines
-   Rapid prototyping under hackathon constraints
-   Structuring projects for scalability

------------------------------------------------------------------------

# 🔮 Future Improvements

Potential future improvements include:

-   Training models on real medical datasets
-   Adding explainability tools such as Grad‑CAM
-   Supporting DICOM medical imaging format
-   Deploying scalable cloud inference
-   Building clinician‑focused interfaces

------------------------------------------------------------------------

# 🧩 Final Thoughts

MediScan AI started as a hackathon prototype, but it became a great
exercise in **AI system architecture and rapid ML product development**.

Even small prototypes can become powerful learning experiences when
approached with a strong architectural mindset.
