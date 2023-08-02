import React from 'react'

function HomePage() {
  //home, about us, review, contact , Goal, terms & conditions  
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">My Website</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="#home">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#about">About Us</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#reviews">Customer Reviews</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#contact">Contact Us</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#terms">Terms &amp; Condition</a>
                </li>
            </ul>
        </div>
    </nav>

    <section id="home" class="container-fluid py-5">
        <div class="container">
            <h1>Welcome to My Website</h1>
            <p>This is the Home section of our website.</p>
        </div>
    </section>

    <section id="about" class="container-fluid py-5 bg-light">
        <div class="container">
            <h2>About Us</h2>
            <p>This is the About Us section where you can learn more about our company.</p>
        </div>
    </section>

    <section id="reviews" class="container-fluid py-5">
        <div class="container">
            <h2>Customer Reviews</h2>
            <p>Read what our customers are saying about us.</p>
        </div>
    </section>

    <section id="contact" class="container-fluid py-5 bg-light">
        <div class="container">
            <h2>Contact Us</h2>
            <p>If you have any questions or inquiries, feel free to get in touch with us.</p>
        </div>
    </section>

    <section id="terms" class="container-fluid py-5">
        <div class="container">
            <h2>Terms &amp; Condition</h2>
            <p>Here are the terms and conditions for using our website.</p>
        </div>
    </section>
    </div>
  )
}

export default HomePage
