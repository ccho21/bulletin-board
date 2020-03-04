import { Component, OnInit } from '@angular/core';


export interface ProjectCard {
  title: string,
  descriptions: string[],
  reference: string,
  image_url: string
}
@Component({
  selector: 'app-daniel-info',
  templateUrl: './daniel-info.component.html',
  styleUrls: ['./daniel-info.component.scss']
})
export class DanielInfoComponent implements OnInit {

  projectCards: ProjectCard[] = [
    {
      title: "Bulletin Board",
      descriptions: [
        "Creating a Instagram style website cooperated with another developer byusingAngular 8 and Firebase.",
        "Implemented authorization, email verification, forgot password, Google login for the login process.",
        "Developed functionaries of creating, editing, deleting, liking, bookmarking a post as well as leaving a comment",
        "Applied the lazy loading for displaying posts in the main page as well as adding a spinner for being user friendly to all visitors."
      ], 
      reference:"https://bulletin-board-d1815.firebaseapp.com/login",
      image_url: "./assets/img/daniel.jpg"
    },
    {
      title: "Shinhan Project",
      descriptions: [
        "Implemented a wide variety of web pages including customization of the table, carousel, card and the mobile-responsive layout by using Bootstrap and jQueryforthe website of Shinhan Bank Canada. ",
        "Developed the Mortgage Calculator, which fetched and updated data through the Restful API and used the Chart.js for the implementation of the line graph, while following the standard provided by the Government of Canada. ",
        "Managed code via X version control and with a designer, respectfully discusses project-related topics "
      ], 
      reference:" https://www.shinhan.ca/ ",
      image_url: "./assets/img/daniel.jpg"
    },
    {
      title: "Shinhan Project",
      descriptions: [
        "Implemented a wide variety of web pages including customization of the table, carousel, card and the mobile-responsive layout by using Bootstrap and jQueryforthe website of Shinhan Bank Canada. ",
        "Developed the Mortgage Calculator, which fetched and updated data through the Restful API and used the Chart.js for the implementation of the line graph, while following the standard provided by the Government of Canada. ",
        "Managed code via X version control and with a designer, respectfully discusses project-related topics "
      ], 
      reference:" https://www.shinhan.ca/ ",
      image_url: "./assets/img/daniel.jpg"
    },
    {
      title: "Shinhan Project",
      descriptions: [
        "Implemented a wide variety of web pages including customization of the table, carousel, card and the mobile-responsive layout by using Bootstrap and jQueryforthe website of Shinhan Bank Canada. ",
        "Developed the Mortgage Calculator, which fetched and updated data through the Restful API and used the Chart.js for the implementation of the line graph, while following the standard provided by the Government of Canada. ",
        "Managed code via X version control and with a designer, respectfully discusses project-related topics "
      ], 
      reference:" https://www.shinhan.ca/ ",
      image_url: "./assets/img/daniel.jpg"
    },
    {
      title: "Shinhan Project",
      descriptions: [
        "Implemented a wide variety of web pages including customization of the table, carousel, card and the mobile-responsive layout by using Bootstrap and jQueryforthe website of Shinhan Bank Canada. ",
        "Developed the Mortgage Calculator, which fetched and updated data through the Restful API and used the Chart.js for the implementation of the line graph, while following the standard provided by the Government of Canada. ",
        "Managed code via X version control and with a designer, respectfully discusses project-related topics "
      ], 
      reference:" https://www.shinhan.ca/ ",
      image_url: "./assets/img/daniel.jpg"
    },
    {
      title: "Shinhan Project",
      descriptions: [
        "Implemented a wide variety of web pages including customization of the table, carousel, card and the mobile-responsive layout by using Bootstrap and jQueryforthe website of Shinhan Bank Canada. ",
        "Developed the Mortgage Calculator, which fetched and updated data through the Restful API and used the Chart.js for the implementation of the line graph, while following the standard provided by the Government of Canada. ",
        "Managed code via X version control and with a designer, respectfully discusses project-related topics "
      ], 
      reference:" https://www.shinhan.ca/ ",
      image_url: "./assets/img/daniel.jpg"
    },
  ]
  constructor() { }

  ngOnInit() {
  }

}
