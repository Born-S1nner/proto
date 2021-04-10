//events (publish subscribe) pattern
let events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || []
        this.events[eventName].push(fn);
    },
    off: function (eventName, fn) {
        if (this.events[eventName]) {
            for (let i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    }
};
// JS on the status
$(function() {
    let numbers = 0;

    let $stats = $('#statsModule');
    let template = $('#stats-template').html();

    events.on('peopleChanged', setPeople);
    _render();

    function _render() {
        $stats.html(Mustache.render(template, { people: numbers }));
    }
    function setPeople(newPeople) {
        numbers = newPeople;
        _render();
    }
    function destroy() {
        $stats.remove();
        events.off('.peopleChanged', setPeople);
    }
})
//JS on peoples list
$(function() {
    let people = ['James', 'Jane'];

    let $button = $('#peopleModule').find('button');
    let $input = $('#peopleModule').find('input');
    let $ul = $('#peopleModule').find('ul');
    let template = $('#peopleModule').find('#people-template').html();

    $button.on('click', addPerson);
    $ul.delegate('i.del', 'click', deletePerson);

    _render();

    function _render() {
        $ul.html(Mustache.render(template, {people: people}));
        events.emit("peopleChanged", people.length);
    }
    function addPerson(value) {
        let name = typeof value === "string" ? value : $input.val();
        people.push(name);
        _render();
        $input.val('');
    }
    function deletePerson(event) {
        let i;
        if (typeof event === "number"){
            i = event;
        } else {
            let $remove = $(event.target).closest('li')
            i = $ul.find('li').index($remove)
        }
        people.splice(i, 1)         
        _render()
    }
    return {
        addPerson: addPerson,
        deletePerson: deletePerson
    };
});
