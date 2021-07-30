const server_message_span = document.getElementById('server-message');
const transfer_message_span = document.getElementById('transfer-message');

const address_input = document.getElementById('address-input');
const port_input = document.getElementById('port-input');

const file_picker_button = document.getElementById('file-picker-input');
const send_action_button = document.getElementById('send-action');

let address = '';
let port = '';
let selected_file = '';
let transferring = false;

window.server.start_server()
    .then(port =>
    {
        server_message_span.innerHTML = `Server is listening on port ${port}`;

        attach_event_handlers();
    });

function attach_event_handlers()
{
    address_input.addEventListener('input', event =>
    {
        address = event.target.value;
    });

    port_input.addEventListener('input', event =>
    {
        port = event.target.value;
    });

    file_picker_button.addEventListener('click', async () =>
    {
        if (transferring)
            return;

        const { canceled, filePaths } = await window.ui.open_dialog();

        if (!canceled && filePaths.length)
        {
            selected_file = filePaths[0];

            transfer_message_span.innerHTML = `Selected ${selected_file}`;
        }
    });

    send_action_button.addEventListener('click', async () =>
    {
        if (transferring)
            return;
        
        if (!selected_file)
            return;

        if (!address || !port)
            return;

        transferring = true;

        transfer_message_span.innerHTML = `Transfer in progress..`;

        try
        {
            await server.send_file_command(selected_file, address, port);

            transfer_message_span.innerHTML = `Transfer succeeded!`;

            selected_file = '';
        }
        catch (error)
        {
            transfer_message_span.innerHTML = `Transfer failed: ${error}`;
        }

        transferring = false;
    });
}