"use strict";

let issueStatusList = document.querySelectorAll(".list-items");
let issues = document.querySelectorAll(".draggable");
let closeIssueButtons = document.querySelectorAll(".close-issue");
let editIssueButtons = document.querySelectorAll(".edit-issue");

let priority = document.getElementById("priority");
let input = document.querySelector(".new-task");
let assignee = document.getElementById("assignee");

let draggableIssue = null;
let editedIssue = null;
let editing = false;

//==================================================================================================

//==============================================================
//=========================DELETING=============================
//==============================================================

function addCloseIssueHandlers() {
  for (let i = 0; i < closeIssueButtons.length; i++) {
    closeIssueButtons[i].addEventListener("click", function () {
      let issueToBeClosed = getIssue(closeIssueButtons[i]);
      let statusList = issueToBeClosed.parentElement;
      if (issueToBeClosed === editedIssue) {
        clearEdit();
      }
      statusList.removeChild(issueToBeClosed);
    });
  }
}

addCloseIssueHandlers();

function getIssue(closeIssueButton) {
  return closeIssueButton.parentElement.parentElement.parentElement;
}
//==================================================================================================

//==================================================================================================
//=======================================================================================
//===================Functions related to draging/droping tasks==========================
//=======================================================================================

function addDraggingHandlers() {
  for (let i = 0; i < issues.length; i++) {
    issues[i].addEventListener("dragstart", function () {
      draggableIssue = this;
    });

    issues[i].addEventListener("dragend", function () {
      draggableIssue = null;
    });
  }
}

addDraggingHandlers();

for (let i = 0; i < issueStatusList.length; i++) {
  issueStatusList[i].addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  issueStatusList[i].addEventListener("dragenter", function () {
    dragEnter();
  });

  issueStatusList[i].addEventListener("dragleave", function () {
    dragLeave();
  });

  issueStatusList[i].addEventListener("drop", function (event) {
    event.preventDefault();
    this.appendChild(draggableIssue);
  });
}

function dragEnter() {
  //console.log("Drag enter");
}

function dragLeave() {
  //console.log("Drag leave");
}

//========================================================
//====================ADD ISSUE===========================
//========================================================

const addIssueButton = document.querySelector(".add-issue-button");

addIssueButton.addEventListener("click", function () {
  if (editing) {
    endEditing();
  } else {
    createIssue();
    document.querySelector(".new-task").value = "";
  }
});

function createIssue() {
  const input = document.querySelector(".new-task");
  if (input.value.isEmpty()) return;
  const prioritySelector = document.getElementById("priority");
  const assigneeSelector = document.getElementById("assignee");

  const issue = document.createElement("li");
  issue.className = "draggable";
  issue.setAttribute("draggable", true);

  /////////////////////HEADER//////////////////////////////
  const issueHeader = document.createElement("div");
  issueHeader.className = "issue-header";

  const priority = document.createElement("option");
  priority.className = prioritySelector.value.toLowerCase();
  priority.value = prioritySelector.value;
  priority.appendChild(document.createTextNode(prioritySelector.value));

  const closeButton = document.createElement("button");
  closeButton.className = "close-issue";
  closeButton.textContent = "\u00D7";

  closeButton.addEventListener("click", function () {
    let issueToBeClosed = getIssue(closeButton);
    let statusList = issueToBeClosed.parentElement;
    statusList.removeChild(issueToBeClosed);
  });

  const editButton = document.createElement("button");
  editButton.className = "edit-issue";
  const editButtonPicture = document.createElement("i");
  editButtonPicture.className = "fa fa-edit";
  editButton.appendChild(editButtonPicture);

  editButton.addEventListener("click", function () {
    let issueToBeEdited = getIssue(editButton);
    startEditingIssue(issueToBeEdited);
  });

  const divButtons = document.createElement("div");
  divButtons.appendChild(editButton);
  divButtons.appendChild(closeButton);

  issueHeader.appendChild(priority);
  issueHeader.appendChild(divButtons);
  /////////////////////HEADER//////////////////////////////

  //////////////////////BODY///////////////////////////////
  const issueBody = document.createElement("div");
  issueBody.appendChild(document.createTextNode(input.value));
  //////////////////////BODY///////////////////////////////

  /////////////////////FOOTER//////////////////////////////
  const issueFooter = document.createElement("div");
  issueFooter.className = "issue-footer";

  const assigneeSign = document.createElement("div");
  assigneeSign.appendChild(document.createTextNode("Assignee:"));

  const assignTo = document.createElement("option");
  assignTo.value = assigneeSelector.value;
  assignTo.appendChild(document.createTextNode(`${assigneeSelector.value}`));

  issueFooter.appendChild(assigneeSign);
  issueFooter.appendChild(assignTo);
  /////////////////////FOOTER//////////////////////////////

  issue.appendChild(issueHeader);
  issue.appendChild(issueBody);
  issue.appendChild(issueFooter);

  //////////////////////DRAG EVENTS////////////////////////
  issue.addEventListener("dragstart", function () {
    draggableIssue = this;
    console.log(this);
  });

  issue.addEventListener("dragend", function () {
    draggableIssue = null;
  });
  //////////////////////DRAG EVENTS////////////////////////

  no_status.appendChild(issue);
}

String.prototype.isEmpty = function () {
  return this.length === 0 || !this.trim();
};

//////////////////////////////////////////////////////////////////
////////////////////////////EDITING///////////////////////////////
//////////////////////////////////////////////////////////////////

function addEditIssueHandlers() {
  for (let i = 0; i < editIssueButtons.length; i++) {
    editIssueButtons[i].addEventListener("click", function () {
      startEditingIssue(getIssue(editIssueButtons[i]));
    });
  }
}

addEditIssueHandlers();

function startEditingIssue(issue) {
  editing = true;
  editedIssue = issue;
  addIssueButton.textContent = "Edit";
  addIssueButton.style.backgroundColor = "Green";
  document.getElementById("priority").value =
    getIssuePriority(editedIssue).value;
  document.querySelector(".new-task").value =
    getIssueBody(editedIssue).textContent;
  document.getElementById("assignee").value =
    getAssignee(editedIssue).textContent;
}

function endEditing() {
  let editedIssuePriority = getIssuePriority(editedIssue);
  editedIssuePriority.value = priority.value;
  editedIssuePriority.textContent = priority.value;
  editedIssuePriority.className = priority.value.toLowerCase();

  getIssueBody(editedIssue).textContent = input.value;

  let editedIssueAssignee = getAssignee(editedIssue);
  editedIssueAssignee.value = assignee.value;
  editedIssueAssignee.textContent = assignee.value;

  clearEdit();
}

function clearEdit() {
  editing = false;
  addIssueButton.textContent = "+ Add Issue";
  addIssueButton.style.backgroundColor = "#2e2eff";
  input.value = "";
  priority.value = "Low";
  assignee.value = "Assignee";

  editedIssue = null;
}

function getIssuePriority(issue) {
  return issue.children[0].children[0]; //.value;
}

function getIssueBody(issue) {
  return issue.children[1]; //.textContent;
}

function getAssignee(issue) {
  return issue.children[2].children[1]; //.textContent;
}
