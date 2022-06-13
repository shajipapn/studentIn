         contract HealthCare
    {
    address private owner; // owner is Insurance Company

    mapping (address => Record[]) public records;
    enum RecordStatus {PENDING, APPROVED, DENIED}

    struct Record {
        uint recordId;
        address patientAddr;
        address hospitalAddr;
        string billId; // points to the pdf stored in supabase
        uint price;
        RecordStatus[] status; // status of the record
        bool isValid; // variable to check if reacord has already been created or not
    }

    constructor() { // set owner on deploy as deployer address
        owner = msg.sender;
    }

    // Helpers
    modifier onlyOwner {
        require(owner == msg.sender, 'Not Authorised');
        _;
    }

    function setOwner(address _owner) onlyOwner external { 
        owner = _owner;
    }

    // Events
    event recordCreated(uint indexed recordId, address indexed patientAddr, address indexed hospitalAddr, uint price);
    event recordSigned(uint indexed recordId, address indexed patientAddr, address indexed hospitalAddr, address owner, uint price, RecordStatus status, string statusMsg);

    // Functions
    function newRecord(address _hospitalAddr, string memory _billId, uint _price) public {
        Record[] storage userRecords = records[msg.sender];
        uint idx = userRecords.length;
        userRecords.push();
        Record storage record = userRecords[idx];
        require(msg.sender != _hospitalAddr, "Patient address and Hospital Address cannot be same.");
        
        record.recordId = idx;
        record.patientAddr = msg.sender;
        record.hospitalAddr = _hospitalAddr;
        record.billId = _billId;
        record.price = _price;
        record.isValid = true;
        record.status.push(RecordStatus.PENDING);
        record.status.push(RecordStatus.PENDING);

        emit recordCreated(record.recordId, record.patientAddr, record.hospitalAddr, record.price);
    }

    function signRecord(uint _id, address _patientAddr, RecordStatus _status, string memory _statusMsg ) public {
        Record storage record = records[_patientAddr][_id];
        require(record.isValid == true, "Record does not exist.");
        require(owner == msg.sender || record.hospitalAddr == msg.sender, "You are not allowed to sign this Record.");
        uint index = 0;
        if (msg.sender == owner) {
            index = 1;
        }

        require(record.status[index] == RecordStatus.PENDING, "Record has already been signed.");

        record.status[index] = _status;
        emit recordSigned(record.recordId, record.patientAddr, record.hospitalAddr, owner, record.price, _status, _statusMsg);
    }

