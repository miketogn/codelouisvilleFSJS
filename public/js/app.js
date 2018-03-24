//******************************************************************

function getAgendas() {
  return $.ajax('/agendas/')
    .then(res => {
      console.log("Results from getAgendas()", res);
      return res;
    })
    .fail(err => {
      console.error("Error in getAgendas()", err);
      throw err;
    });
}

//******************************************************************

function refreshAgendaList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getAgendas()
    .then(agendas => {

      window.agendaList = agendas;

      const data = {agendas: agendas};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}

//******************************************************************

function handleAddAgendaClick() {
  console.log("Baby steps...");
  setFormData({});
  toggleAddAgendaFormVisibility();  
}

//******************************************************************

function handleAddItemClick() {
  console.log("Baby steps...");
  setFormData({});
  toggleAddItemFormVisibility();  
}

//******************************************************************

function toggleAddItemFormVisibility() {
  $('#item-form-container').toggleClass('hidden');
}

//******************************************************************

function toggleAddAgendaFormVisibility() {
  $('#form-container').toggleClass('hidden');
}

//******************************************************************

// Set form agenda form data

function setFormData(data) {
  data = data || {};

  const agenda = {
    title: data.title || '',
    _id: data._id || '',
  };

  $('#agenda-title').val(agenda.title);
  $('#agenda-id').val(agenda._id);
}

//******************************************************************

// Set form item form data

function setItemFormData(agendaId, data) {
  data = data || {};

  const item = {
    title: data.title || '',
    _id: data._id || '',
  };

  $('#agenda-id').val(agendaId);
  $('#item-title').val(item.title);
  $('#item-id').val(item._id);
}

//******************************************************************

function cancelAgendaForm() {
  toggleAddAgendaFormVisibility();
}

//******************************************************************

function cancelItemForm() {
  toggleAddItemFormVisibility();
}

//******************************************************************

// Edit agenda 

function handleEditAgendaClick(id) {
  const agenda = window.agendaList.find(agenda => agenda._id === id);  
  if (agenda) {
    setFormData(agenda);
    toggleAddAgendaFormVisibility();
  } 
}

//******************************************************************

// Edit item

function handleEditItemClick(agendaId, id) {
  const agenda = window.agendaList.find(agenda => agenda._id === agendaId);  
  const item = agenda.items.find(item => item._id === id);
  if (item) {
    setItemFormData(agendaId, item);
    toggleAddItemFormVisibility();
  } 
}

//******************************************************************

// Opens the Add Item form and passes the correct agenda ID

function handleAddItemClick(id) {
  const agenda = window.agendaList.find(agenda => agenda._id === id);
  if (agenda) {
    console.log("you clicked add an item to the agenda with the id of ", id);
    setFormData(agenda);
    toggleAddItemFormVisibility();
  } 
}

//******************************************************************

//Submits the Item form to create a new item 

function submitItemForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const itemData = {
    title: $('#item-title').val(),
    _id: $('#item-id').val(),
  };


  const agendaId = $('#agenda-id').val();

  let method, url;
  if (itemData._id) {
    method = 'PUT';
    url = `/agendas/${agendaId}/items/${itemData._id}`
  } else {
    method = 'POST';
    url = '/agendas/' + agendaId + '/items';
    itemData._id = undefined;
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(itemData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshAgendaList();
      toggleAddItemFormVisibility();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    });

  console.log("Your Item Data", itemData);
}

//******************************************************************

//Submits the Agenda form to both create a new agenda and edit and existing agenda

function submitAgendaForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const agendaData = {
    title: $('#agenda-title').val(),
    _id: $('#agenda-id').val(),
  };

  let method, url;
  if (agendaData._id) {
    method = 'PUT';
    url = '/agendas/' + agendaData._id;
  } else {
    method = 'POST';
    url = '/agendas/';
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(agendaData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshAgendaList();
      toggleAddAgendaFormVisibility();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    });

  console.log("Your Agenda Data", agendaData);
}

//******************************************************************

// Delete (soft) an agenda

function handleDeleteAgendaClick(id) {
  if (confirm("Are you sure?")) {
    deleteAgenda(id);
  }
}

function deleteAgenda(id) {
  $.ajax({
    type: 'DELETE',
    url: '/agendas/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("Agenda", id, "is DOOMED!!!!!!");
      refreshAgendaList();
    })
    .fail(function(error) {
      console.log("I'm not dead yet!", error);
    })
}

//******************************************************************

// Delete an Item

function handleDeleteItemClick(agendaId, id) {
  const agenda = window.agendaList.find(agenda => agenda._id === agendaId);  
  const item = agenda.items.find(item => item._id === id);
  if (confirm("Are you sure?")) {
    deleteItem(agendaId, id);
  }
}

function deleteItem(agendaId, id) {
  $.ajax({
    type: 'DELETE',
    url: '/agendas/' + agendaId + '/items/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("Item", id, "is DOOMED!!!!!!");
      refreshAgendaList();
    })
    .fail(function(error) {
      console.log("I'm not dead yet!", error);
    })
}

//******************************************************************

refreshAgendaList();
