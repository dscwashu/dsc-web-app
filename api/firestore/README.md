# Users:

```
{
  profile: {
    firstName: String;
    lastName: String;
    role: String;
    grade: Number;
    website: String;
    skills: List;
    courses: List;
    bio: String;
  };
  account: {
    createdAt: Time;
    email: String;
  };
  isAdmin: Boolean;
}
```

Data flow:

1. Create a user
   - `isAdmin` is set to `false`
   - `account` is valid
     - `account.createdAt` was the request's time
     - `account.email` was the request's user's email
   - `profile` is valid
     - `profile.firstName` is less than 35 chars and not empty
     - `profile.secondName` is less than 35 chars and not empty
     - `profile.role` is valid
       - If `profile.role` is `student`, the request's user's email is a @wustl.edu address
       - Or the `profile.role` is `org`
     - `profile.grade` is valid
       - `profile.grade` is 0
       - Or `profile.grade` is 1, 2, 3, 4, or 5 (graduate)
     - `profile.website` is a valid URL
     - `profile.skills` and `profile.courses` are both empty lists []
     - `profile.bio` is less than 500 chars
2. Read a user
   - If they are authenticated
3. List users
   - Same as `read` but it's limited to a query limit of 10
4. Update a user
   - If the request's user owns the user
     - `account` is unmodified
     - `isAdmin` is unmodified
     - `profile` is valid
       - `profile.firstName` is less than 35 chars and not empty
       - `profile.secondName` is less than 35 chars and not empty
       - `profile.role` is valid
         - If `profile.role` is `student`, the request's user's email is a @wustl.edu address
         - Or the `profile.role` is `org`
       - `profile.grade` is valid
         - `profile.grade` is 0
         - Or `profile.grade` is 1, 2, 3, 4, or 5 (graduate)
       - `profile.website` is a valid URL
       - `profile.skills` and `profile.courses` are valid
         - `profile.skills` and `profile.courses` are both empty lists []
         - Or the request's user is a student and `profile.skills` and `profile.courses` both contain valid items from the lists data
       - `profile.bio` is less than 500 chars
   - If the request's user is an admin
     - `isAdmin` is a Boolean
5. Delete a user
   - If the request's user owns the user

# Lists:

```
{
  tags?: List;
  questions?: List;
  isAcceptingApplications?: Boolean;
}
```

Data flow:

1. Create a list
   - Not allowed
2. Read a list
   - If they are authenticated
3. List events
   - Not allowed
4. Update a list
   - The request's user must be an admin
   - If the list name is `courses`, `skills`, or `industries`, `tags` must be a list
   - If the list name is `projectQuestions` or `coreTeamQuestions`
     - `questions` must be a list
     - `isAcceptingApplications` must be a boolean
5. Delete a list
   - Not allowed

# Events:

```
{
  info: {
    title: String;
    description: String;
    startTime: Time;
    endTime: Time;
    location: String;
  },
  users: List;

}
```

Data flow:

1. Create an event
   - `users` is set to an empty list []
   - `info.title` is less than 100 chars and not empty
   - `info.description` is less than 500 chars and not empty
   - `info.startTime` is a timestamp and less than `info.endTime`
   - `info.title` is a timestamp and greater than `info.startTime`
   - `info.location` is less than 100 chars and not empty
2. Read an event
   - If they are authenticated
3. List events
   - Same as `read` but it's limited to a query limit of 10
4. Update an event
   - `info` is unmodified
   - 2 options
     - A user is added and the size of `users` is increased by 1 and contains all previous users and current request's user.
     - A user is removed and the size of `users` is decreased by 1 and contains all previous users minus the current request's user.
5. Delete an event
   - If the request's user is an admin

# Applications:

```
{
  info: {
    createdAt: Time;
    user: UserID;
    type: "projectManager" | "projectMember" | "coreTeam" | "studentProject" | "orgProject"
    project: ProjectID
    answers: List;
  },
  accepted: Boolean;
  pending: Boolean;
}
```

Data flow:

1. Create an application
   - Request has to be made from authenticcated user
   - `accepted` has to be `false`
   - `pending` has to be `true`
   - `info` has to be valid
     - `info.createdAt` has to be set to request time
     - `info.user` has to be the same as the request's user
     - `info.answers` has to be a list
     - If `info.type` is `projectManager` or `projectMember`, it has to be valid
       - The request's user has to be a student
       - If `info.type` is `projectManager`, the `info.project` has to be accepting a project manager
       - If `info.type` is `projectMember`, the `info.project` has to be accepting project members
     - If `info.type` is `coreTeam`, `studentProject`, or `orgProject`, it has to be valid
       - The `project` has to be empty
       - If `info.type` is `coreTeam`, then core team list must be accepting applications
       - If `info.type` is `studentProject`, then request's user must be a student
       - If If `info.type` is `orgProject`, then requests' user must not be a stuent
2. Read an application
   - If they are the creator the application
   - If they are an administrator
   - If they are the project manager and `info.type` is `projectmember`
3. List applications
   - Same as `read` but it's limited to a query limit of 10
4. Update an application
   - `info` is unmodified
   - `pending` is set to `false`
   - `accepted` is set to a Boolean
   - The user has permissions
     - If the `info.type` is `projectMember`, the user must be the project manager
     - If the `info.type` is `projectManager`, `coreTeam`, `studentProject`, or `orgProject`, the user must be an admin
5. Delete an application
   - Request's user must be the ower of the application.

# Projects:

```
{
  info: {
    description: String;
    github: String;
    title: String;
    skills: List;
    industries: List;
    isAcceptingApplications: Boolean;
    platforms: ("web" | "mobile" | "desktop" | "hardware")[];
    projectMemberQuestions: List;
  },
  orgInfo: {
    createdAt: Time;
    type: "nonprofit" | "business" | "student";
    org: UserID;
  },
  projectManagerInfo: {
    isAcceptingApplications: Boolean;
    projectManager: UserID;
  },
  finished: Boolean;
  users: List;
}
```

Data flow:

1. Create a project
   - The request's user has to be admin
   - `.../private/resources/` document has been created
   - `finished` must be `false`
   - `users` must be an empty list []
   - `info` must be valid
     - `info.description` is less than 500 chars and not empty
     - `info.github` is less than 100 chars and has no spaces
     - `info.title` is less tha 100 chars and not empty
     - `info.skills` and `info.industries` are valid
       - `info.skills` and `info.industries` are both empty lists []
       - Or `profile.skills` and `profile.courses` both contain valid items from the lists data
     - `info.isAcceptingApplications` is set to false
     - `info.platforms` is a list of "web", "mobile", "desktop", or "hardware"
     - `info.projectMemberQuestions` is an empty list []
   - `orgInfo` must be valid
     - `orgInfo.createdAt` was the request's time
     - `orgInfo.type` is "nonprofit", "business", or "student"
     - `orgInfo.org` is a UserID with a role of "org"
   - `projectManagerInfo` must be valid
     - `projectManagerInfo.isAcceptingApplications` is set to true
     - `projectManagerInfo.projectManager` is set to empty string ""
2. Read a project
   - If they are authenticated
3. List projects
   - Same as `read` but it's limited to a query limit of 10
4. Update projects
   - If the request's user is the project manager of the project
     - Update of info is valid
       - `finished` is unmodified
       - `projectManagerInfo` is unmodified
       - `orgInfo` is unmodified
       - `users` is unmodified
       - `info` is valid
         - `info.description` is less than 500 chars and not empty
         - `info.github` is less than 100 chars and has no spaces
         - `info.title` is less tha 100 chars and not empty
         - `info.skills` and `info.industries` are valid
           - `info.skills` and `info.industries` are both empty lists []
           - Or `profile.skills` and `profile.courses` both contain valid items from the lists data
         - `info.isAcceptingApplications` is a Boolean
         - `info.platforms` is a list of "web", "mobile", "desktop", or "hardware"
         - `info.projectMemberQuestions` is a list
     - Update of users is valid
       - `finished` is unmodified
       - `projectManagerInfo` is unmodified
       - `orgInfo` is unmodified
       - `info` is unmodified
       - `users` is valid
         - A user was added and the size increased by 1
         - A user was removed and the size decreased by 1
   - If the request's user is an admin
     - Update of project manager is valid
       - `finished` is unmodified
       - `orgInfo` is unmodified
       - `info` is unmodified
       - `projectManagerInfo` is valid
         - Adding a project manager
           - `projectManagerInfo.isAcceptingApplications` is false
           - `projectManagerInfo.projectManager` is an a student
           - `users` is a list containing the project manager
         - Removing a project manager
           - `projectManagerInfo.isAcceptingApplications` is true
           - `projectManagerInfo.projectManager` is empty
           - `users` doesn't contain the project manager anymore
     - Update of finished is valid
       - `projectManagerInfo` is unmodified
       - `orgInfo` is unmodified
       - `info` is unmodified
       - `users` is unmodified
       - `finished` is a Boolean
5. Delete a project
   - Request's user must be an admin

# Private Project Resources:

```
{
  resources: List;
}
```

Data Flow:

1. Create an application
   - the request's user must be an admin
   - `resources` must be an empty list []
2. Read an application
   - If they are a project member
3. List applications
   - Not allowed
4. Update an application
   - the request's user must be a project manager
   - `resources` must be a list
5. Delete a resource
   - Not allowed
