import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  newsletterEmail = '';
  newsletterSubmitted = false;

  private observers: IntersectionObserver[] = [];

  ngAfterViewInit(): void {
    const animatedEls = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    animatedEls.forEach((el) => observer.observe(el));
    this.observers.push(observer);
  }

  ngOnDestroy(): void {
    this.observers.forEach((obs) => obs.disconnect());
  }

  scrollToServices(): void {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  submitNewsletter(): void {
    if (this.newsletterEmail) {
      this.newsletterSubmitted = true;
    }
  }
}
