

export function ChatList({
    isOpen,
    toggleChatList,
  }: {
    isOpen: boolean;
    toggleChatList: () => void;
  }) {
    return (
      <div
    className={`fixed right-0 top-0 h-screen bg-[#ffffff] text-white p-8 flex flex-col transition-transform border-l border-black ${
      isOpen ? "translate-x-0" : "translate-x-full"
    } w-[300px] min-w-[250px] md:w-[680px] sm:w-[200px] sm:min-w-[200px]`}
    style={{
      zIndex: isOpen ? 50 : 0,
    }}
  >
        <button
          className="absolute top-4 left-4 md:hidden"
          onClick={toggleChatList}
        >
          Close
        </button>
       
      </div>
    );
  }