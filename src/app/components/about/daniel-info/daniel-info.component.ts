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
      reference:" https://bulletin-board-d1815.firebaseapp.com/login",
      image_url: "./assets/img/daniel-olahh.jpg"
    },
    {
      title: "Shinhan Project",
      descriptions: [
        "Implemented a wide variety of responsive and user-friendly web pages including customization of the animation, carousel and layout by using Bootstrap 4 and jQuery for the website project of Shinhan Bank Canada.",
        "Developed accessible user interface and functionalities of the Mortgage Calculator, line graphs, and the Currency Exchange Calculator, which handled data through the Restful APIs while following the government standards of Canada.",
        "Managed code via Git, and with a designer, respectfully discussed project-related topics such as the concept design for a website and the detailed specifications of each web page."
      ], 
      reference:" https://www.shinhan.ca/ ",
      image_url: "./assets/img/back 4.jpeg"
    },
    {
      title: "Canadian Park Information Blog",
      descriptions: [
        "Implemented a Canadian Park Information Blog for users to obtain Ontario campsite information through using a Restful API.",
        "Provided a leaderboard to share stories and experiences with others through Spring Framework(STS), MyBatis, and jQuery.",
        "Developed user and leaderboard related APIs to manage data about Ontario Parks from a relational database MySQL.",
        "Modified and built bootstrap 4 components as well as functionalities such as sorting and showing top popular five places, leaving a comment on each article and updating a user’s own profile."
      ], 
      reference:"https://gitlab.com/daniel.tutoring/springmvc/-/tree/init",
      image_url: "./assets/img/back 3.jpeg"
    },
    {
      title: "My Personal Website",
      descriptions: [
        "Used an existing bootstrap template and modified code to design and develop my personal website with user-friendly interface.",
        "Improved user accessibility by following and surpassing the Web Accessibility standards stated by the Government of Canada.",
        "Hosted meetings with classmates to give and receive constructive feedback based on how we coded our individual website."
      ], 
      reference:"https://gitlab.com/daniel.tutoring/personal/-/tree/init/src/components/layout",
      image_url: "./assets/img/back2.jpeg"
    },
  ]
  constructor() { }

  ngOnInit() {
  }

}
