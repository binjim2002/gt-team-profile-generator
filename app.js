const Manager = require("./Develop/lib/Manager");
const Engineer = require("./Develop/lib/Engineer");
const Intern = require("./Develop/lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const employees = [];

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./Develop/lib/htmlRenderer");


const newEmployeeQuestions = [
    {
        name: 'name',
        message: 'What is the name of the employee?'
    },
    {
        name:'id',
        message: 'What is the employee\'s id?',
        // validate: answers => {
        //     if(! /^\d+$/.test(answers.id)){
        //         return "Id must be a number"
        //     }
        //     return true;
        // }
    },
    {
        name:'email',
        message:'What is the employee\'s email?'
    },
    {
        name:'dynamic',
        message:''
    }
];

const dictionary = {
    Manager,
    Engineer,
    Intern
}

class CliTool{
    mainMenu(){
        this.ask([
            {
                name: 'action',
                message: 'What do you want to do?',
                type: 'list',
                choices: ['add employee', 'render page']
            }
        ],task =>{
            switch(task.action){
                case 'add employee':
                    this.addEmployee();
                    break;
                case 'render page':
                    this.render();
                    break;
            }
           
        })
    }
    getEmployeeChoices(){
        const choices = ['Engineer','Intern'];
        if(employees.filter(employee => {
            
            return employee.getRole() === 'Manager'
        }).length < 1){
            return ['Manager', ...choices];
        } 
        return choices;
    }
    addEmployee(){
        const choices = this.getEmployeeChoices();
        const questions = [{
            name:'newEmployee',
            message: 'What kind of employee do you want to add?',
            type:'list',
            choices:choices
        }]
        this.ask(questions,answer=>{
            switch(answer.newEmployee){
                case 'Manager': newEmployeeQuestions[3].message = 'Please provide the office number'; break;
                case 'Engineer': newEmployeeQuestions[3].message = 'Please provide a github account'; break;
                case 'Intern': newEmployeeQuestions[3].message = 'Which school does the intern attend?'; break;
            }
            
            this.ask(newEmployeeQuestions,details=>{
                employees.push(new dictionary[answer.newEmployee](details.name, details.id, details.email, details.dynamic));
                this.mainMenu();
                
            })
        })
    }
    render(){
        fs.writeFile(path.resolve(__dirname)+'/output/team.html', render(employees), 'utf8', function(err){
            if(err){
                console.log(err)
            }
            
        })
    }
    ask(questions,callback){
        inquirer.prompt(questions)
        .then(callback)
    }
}


const program = new CliTool();
program.mainMenu();


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
